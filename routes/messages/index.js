let express = require('express');
const Message = require('./../../model/Message')
const User = require('./../../model/User')
let router = express.Router();
router.post('/',function (req,res,next) {
    let token = req.headers['auth-token']
    User.findOne({token: token},function (err,user) {
        if(err)
        {
            next(err)
        }
        else {
            let body = req.body
            body.user = user._id
            var message = new Message(req.body)
            message.save(function (err,info) {
                if(err)
                {
                    next(err)
                }
                else{
                    res.json(info)
                }
            })
        }
    })
})
module.exports = router;
