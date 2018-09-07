let express = require('express');
const Group = require('./../../model/Group')
const Project = require('./../../model/Project')
const User = require('./../../model/User')
const Message = require('./../../model/Message')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
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
router.post('/',function (req,res,next) {
    let members = []
    User.findOne({token: req.headers['auth-token']},function (err,user) {
        if(err)
        {
            next(err)
        }
        else{
            members.push(user._id)
            let body = req.body
            body.members = members
            let group = new Group(body)
            group.save(function (err,doc) {
                if(err)
                {
                    next(err)
                }
                else{
                    user.groups.push(group._id)
                    user.save(function (err) {
                        if(err)
                        {
                            next(err)
                        }
                        else{
                            res.json(doc)
                        }
                    })
                }
            })
        }
    })
})
router.post('/get-out/:id',function (req,res,next) {
    User.findOne({token: req.headers['auth-token']},function (err,user) {
        if(err)
        {
            next(err)
        }
        else{
            Group.findOne({id: req.params.id},function (err,group) {
                if(err)
                {
                    next(err)
                }
                else{
                    group.members =  group.members.filter(mem => {
                        return !mem.equals(user._id)
                    })
                    group.save(function (err,doc) {
                        if(err)
                        {
                            next(err)
                        }
                        else {
                            user.groups = user.groups.filter(item => {
                                return !item.equals(group._id)
                            })
                            user.save(function (err) {
                                if(err)
                                {
                                    next(err)
                                }
                                else{
                                    if(group.members.length == 0)
                                    {
                                        Group.deleteOne({ id: group.id }, function (err) {
                                            if (err)
                                            {
                                                next(err);
                                            }
                                            else{
                                                Message.deleteMany({group: Schema.Types.Object(group._id)},function (err) {
                                                    if(err)
                                                    {
                                                        next(err)
                                                    }
                                                    else{
                                                        User.updateMany({groups: Schema.Types.Object(group._id)}, { $pullAll: {groups: [Schema.Types.Object(group._id)] } } ,function(err){
                                                            if(err)
                                                            {
                                                                next(err)
                                                            }
                                                            else{
                                                                res.json({})
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        });
                                    }
                                    else{
                                        res.json({})
                                    }
                                }
                            })

                        }
                    })
                }
            })
        }
    })
})
module.exports = router;
