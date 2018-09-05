let express = require('express');
const User = require('./../../model/User')
let router = express.Router();
router.get('/', function(req, res, next) {

    User.find({},function (err,docs) {
        if(err)
        {
            res.json(err)
        }
        else{
            res.json(docs)
        }
    })

});
router.get('/:id',function (req,res,next) {
    User.findOne({id : req.params.id}).populate('company').exec(function (err,doc) {
        if(err){
            res.json(err)
        }
        else{
            res.json(doc)
        }
    })
})
router.put('/:id/edit',function (req,res,next) {
    User.findOne({id : req.params.id}).populate('company').exec(function (err,doc) {
        if(err){
            res.json(err)
        }
        else{
            let dataUpdate = req.body
            let keys = doc.toObject()
            keys = Object.keys(keys)
            keys.forEach(key=>{
                if(key in dataUpdate)
                {
                    doc[key] = dataUpdate[key]
                }
            })
            doc.save(function (err,result) {
                if(err)
                {
                    res.json(err)
                }
                else {
                    res.json(result)
                }
            })
        }
    })
})
router.post('/registration',function (req,res,next) {
    var user = new User(req.body)
    user.save(function (err,info) {
        if(err)
        {
            res.json(err)
        }
        else{
            res.json(info)
        }
    })
})
module.exports = router;
