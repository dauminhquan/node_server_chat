let express = require('express');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const User = require('./../../model/User')
const Company = require('./../../model/Company')
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
router.get('/info',function (req,res,next) {
    let token = req.headers['auth-token']
    User.findOne({token: token},function (err,user) {
        if(err)
        {
            return next(err)
        }
        else{
            user  = user.toJSON()
            res.json(user)
        }
    })
})
router.get('/info/:id/',function (req,res,next) {
    User.findOne({id : req.params.id}).populate('company').exec(function (err,doc) {
        if(err){
            res.json(err)
        }
        else{
            res.json(doc)
        }
    })
})
router.get('/groups',function (req,res,next) {
    let token = req.headers['auth-token']
    User.findOne({token : token}).populate({
        path    : 'groups',
        populate: [
            {
                path: 'members',
                select: 'username avatar id _id'
            }
        ]
    }).exec(function (err,doc) {
        if(err){
            res.status(500)
            res.json(err)
        }
        else{
            res.json({
                groups: doc.groups
            })
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
            return next(err)
        }
        else{
            Company.findById(req.body.company,function (err,doc) {
                if(err)
                {
                    User.delete({id: user.id},function (err2) {
                        if(err2)
                        {
                            next(err2)
                        }
                        else{
                            return next(err)
                        }
                    })

                }
                else {
                    doc.members.push(info._id)
                    doc.save(function (err,f) {
                        if(err)
                        {
                            res.status(500)
                            res.json(err)
                        }
                        else{
                            res.json(info)
                        }
                    })
                }
            })
        }
    })
})
module.exports = router;
