let express = require('express');
const User = require('./../../model/User')
let router = express.Router();
router.post('/login', function(req, res, next) {
    User.findOne({email : req.body.email},function (err,doc) {
        if(err)
        {
            res.status(404);
            res.json(err)
        }
        else{
            if(doc == null)
            {
                res.status(404);
                res.json(doc)
            }
            else{
                doc.comparePassword(req.body.password,function (err,data) {
                    if(err){
                        res.status(404);
                        res.json(null)
                    }
                    else{
                        let user = doc.toJSON()
                        delete user.password
                        res.json({
                            user: user
                        })
                    }
                })
            }
        }
    })

});
router.post('/auth',function (req,res,next) {
    let token = req.headers['Auth-Token']

    if(token == null || token == undefined)
    {
        res.status(403)
        res.json({
            auth: 'Not Accept'
        })
    }
    else {
        User.findOne({token: token},function (err,user) {
            if(err)
            {
                return next(err)
            }
            else{
                if(user == null)
                {
                    res.status(406)
                    res.json({
                        auth: 'Not Accept'
                    })
                }
                else{
                    res.json({
                        auth: 'Accepted',
                        user:user
                    })
                }
            }
        })
    }
})
module.exports = router;
