let express = require('express');
const Message = require('./../../model/Message')
const User = require('./../../model/User')
let router = express.Router();
router.post('/',function (req,res,next) {
    let token = req.headers['auth-token']
    let io = res.io
    User.findOne({token: token},function (err,user) {
        if(err)
        {
            return next(err)
        }
        else {
            let body = req.body
            body.user = user._id
            var message = new Message(req.body)
            message.save(function (err,info) {
                if(err)
                {
                    return next(err)
                }
                else{
                    io.emit('chanel-group-'+body.group,{
                        id: message._id,
                        userId: user.id,
                        userName: user.username,
                        message: message.content,
                        messageText: message.contentText,
                        time: message.created_at,
                        type: message.type,
                        userAvatar: user.avatar,
                        location: message.location
                    })
                    res.json(info)
                }
            })
        }
    })
})
module.exports = router;
