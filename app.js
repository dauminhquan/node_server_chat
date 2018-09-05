const createError = require('http-errors');
const config = require('./config/index');
const db = require('./config/db');
const serverConfig = require('./config/server');
const modules = require('./config/module');
const server = serverConfig.server;
const indexRouter = require('./routes')
const app = serverConfig.app;
const User = require('./model/User')
const io = require('socket.io')(server);
modules.init(app);
db.init(config);
io.on('connection',function(socket){
    console.log('1 client vừa kết nối')
})
app.use(function (req,res,next) {
    res.io = io
    next()
})
// All Router
// app.use(function(req, res, next){
//     // console.log(req.headers)
//     let token = req.headers['auth-token']
//     if(token == null || token == undefined)
//     {
//         if(req.originalUrl == '/login')
//         {
//             res.io = io;
//             next()
//         }
//         else{
//             console.log(token)
//             User.findOne({token: token},function (err,doc) {
//                 if(err){
//                     res.status(404)
//                     res.json(err)
//                 }
//                 if(doc == null)
//                 {
//
//                     res.status(406)
//                     res.json({
//                         authentication : false
//                     })
//                 }
//                 else{
//                     res.io = io;
//                     next()
//                 }
//             })
//         }
//     }
// });
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
