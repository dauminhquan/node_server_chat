let express = require('express');
let router = express.Router();
router.get('/', function(req, res, next) {
  let io = res.io
    io.emit('chanel_group_5b8f7de840cc4205c4a56ded',{a: 'b'})
  res.send('hello')
});
router.use('/companies',require('./companies'))
router.use('/users',require('./users'))
router.use('/groups',require('./groups'))
router.use('/projects',require('./projects'))
router.use('/messages',require('./messages'))
router.use(require('./auth'))
module.exports = router;
