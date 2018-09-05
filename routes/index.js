let express = require('express');
let router = express.Router();
router.get('/', function(req, res, next) {
  let io = res.io
    io.emit('test',{a: 'b'})
  res.send('hello')
});
router.use('/companies',require('./companies'))
router.use('/users',require('./users'))
router.use(require('./auth'))
module.exports = router;
