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
                        res.json({
                            token: doc.token
                        })
                    }
                })
            }
        }
    })

});
router.post('/auth',function (req,res,next) {
    res.send('ok')
})
module.exports = router;
