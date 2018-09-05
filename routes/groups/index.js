let express = require('express');
const Group = require('./../../model/Group')
const Project = require('./../../model/Project')
const User = require('./../../model/User')
const Message = require('./../../model/Message')
let router = express.Router();
router.get('/', function(req, res, next) {

    Group.find({},function (err,docs) {
        if(err)
        {
            res.json(err)
        }
        else{
            res.json(docs)
        }
    })

})
router.post('/',function (req,res,next) {
    let group = new Group(req.body)
    group.save(function (err,group) {
        if(err)
        {
            next(err)
        }
        else {
            // res.json(group)
            let mem = User.findOne({token: req.headers['auth-token']},function (err,user) {
                if(err)
                {
                    next(err)
                }
                else {
                    group.members.push(user._id)
                    group.save(function (err,doc) {
                        if(err)
                        {
                            next(err)
                        }
                        else{
                            user.groups.push(group._id)
                            user.save(function (err,doc) {
                                if(err)
                                {
                                    next(err)
                                }else {
                                    res.json(group)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
router.get('/info:id',function (req,res,next) {
    Group.findOne({id : req.params.id}).populate('project').exec(function (err,doc) {
        if(err)
        {
            res.json(err)
        }
        Project.findById(doc.project.id).populate('company').exec(function (err,docT) {
            if(err){
                res.json(err)
            }
            else{
                res.json(doc)
            }
        })
    })
})
router.put('/info/:id/edit',function (req,res,next) {
    Group.find({id : req.params.id}).populate('project').exec(function (err,doc) {
        if(err)
        {
            res.json(err)
        }
        Project.findById(doc.project.id).populate('company').exec(function (err,docT) {
            if(err){
                res.json(err)
            }
            else{
                res.json(doc)
            }
        })
    })
})
router.get('/:id/messages',function (req,res,next) {
    Message.find({group: req.params.id}).populate({
        path: 'users',
        select: '_id id username avatar'
    }).exec(function (err,messages) {
            if(err)
            {
                next(err)
            }
            else{
                res.json(messages)
            }
    })
})
module.exports = router;
