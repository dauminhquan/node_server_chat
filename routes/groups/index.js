let express = require('express');
const Group = require('./../../model/Group')
const Project = require('./../../model/Project')
const User = require('./../../model/User')
const Message = require('./../../model/Message')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let router = express.Router();

// router.get('/', function(req, res, next) {
//
//     Group.find({},function (err,docs) {
//         if(err)
//         {
//             res.json(err)
//         }
//         else{
//             res.json(docs)
//         }
//     })
//
// })
router.get('/info:id',function (req,res,next) {
    let token = req.headers['auth-token']
    User.find({token: token},function (err,user) {
        if(err)
        {
            return next(err)
        }
        else{
            Group.findOne({id : req.params.id}).populate('project').exec(function (err,doc) {
                if(err)
                {
                    res.json(err)
                }
                if(doc == null)
                {
                    res.status(404)
                    return res.json({
                        Group: "NotFound"
                    })
                }
                if(!doc.members.includes(user._id))
                {
                    res.status(404)
                    res.json({
                        message: 'Group NotFound'
                    })
                }
                else{
                    Project.findById(doc.project.id).populate('company').exec(function (err,docT) {
                        if(err){
                            res.json(err)
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
router.put('/info/:id/edit',function (req,res,next) {
    let token = req.headers['auth-token']
    let body = req.body
    User.find({token: token},function (err,user) {
        if(err)
        {
            return next(err)
        }
        else{
            Group.findOne({id : req.params.id}).exec(function (err,doc) {
                if(err)
                {
                    res.json(err)
                }
                if(doc == null)
                {
                    res.status(404)
                    return res.json({
                        Group: "NotFound"
                    })
                }
                if(doc.owner =! user._id)
                {
                    res.status(404)
                    return res.json({
                        message: 'Group NotFound'
                    })
                }
                else{
                    let groupObject = doc.toJSON()
                    let keys = Object.keys(groupObject)
                    keys.forEach(function (item) {
                        if(body[item] != undefined)
                        {
                            doc[item] = body[item]
                        }
                    })
                    doc.save(function (err,d) {
                        if(err)
                        {
                            return next(err)
                        }
                        else{
                            return res.json(d)
                        }
                    })
                }
            })
        }
    })

})
router.put('/info/:id/add-member/:userId',function (req,res,next) {
    let token = req.headers['auth-token']
    let body = req.body
    User.findOne({token: token},function (err,user) {
        if(err)
        {
            return next(err)
        }
        else{
            Group.findOne({id : req.params.id}).exec(function (err,group) {
                if(err)
                {
                    res.json(err)
                }
                if(group == null)
                {
                    res.status(404)
                    return res.json({
                        Group: "NotFound"
                    })
                }
                if(!group.members.some(function (objId) {
                    return objId.equals(user._id)
                }))
                {
                    res.status(404)
                    return res.json({
                        message: 'Group NotFound'
                    })
                }
                else{
                    User.findOne({id: req.params.userId},function (err,user2) {
                        if(err)
                        {
                            return next(err)
                        }
                        if(user2 == null)
                        {
                            res.status(404)
                            return res.json({
                                user: 'NotFound'
                            })
                        }
                        else{
                            if(group.members.some(function (objId) {
                                return objId.equals(user2._id)
                            }))
                            {
                                res.status(406)
                                return res.json({
                                    result: 'Double user'
                                })
                            }
                            else {
                                group.members.push(user2._id)
                                group.save(function (err,doc) {
                                    if(err)
                                    {
                                        return next(err)
                                    }else{
                                        if(!user2.groups.some(g => {
                                            return g.equals(group._id)
                                        }))
                                        {
                                            user2.groups.push(group._id)
                                            user2.save(function (err,doc) {
                                                if(err)
                                                {
                                                    group.members = group.members.filter(item => {
                                                        return !item.equals(user2._id)
                                                    })
                                                    group.save(function (err,doc) {
                                                        if(err)
                                                        {
                                                            return next(err)
                                                        }
                                                    })
                                                    return next(err)
                                                }
                                                else{
                                                    return res.json({
                                                        result: 'Added'
                                                    })
                                                }
                                            })
                                        }
                                        else{
                                            return res.json({
                                                result: 'Added'
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })

                }
            })
        }
    })

})
router.delete('/info/:id',function (req,res,next) {
    let token = req.headers['auth-token']
    User.find({token: token},function (err,user) {
        if(err)
        {
            return next(err)
        }
        else{
            Group.findOne({id : req.params.id}).exec(function (err,doc) {
                if(err)
                {
                    res.json(err)
                }
                if(doc == null)
                {
                    res.status(404)
                    return res.json({
                        Group: "NotFound"
                    })
                }
                if(doc.owner =! user._id)
                {
                    res.status(404)
                    return res.json({
                        message: 'Group NotFound'
                    })
                }
                else{
                    Group.deleteOne({id : req.params.id},function (err) {
                        if(err)
                        {
                            return next(err)
                        }
                        else{
                            return res.json({
                                result: 'success'
                            })
                        }
                    })
                }
            })
        }
    })

})
router.get('/:id/messages',function (req,res,next) {
    let skip = parseInt(req.query.skip)
    if(skip == undefined || skip == null || skip <= 0 && skip != -1)
    {
        skip = 1
    }
    let token = req.headers['auth-token']
    let body = req.body
    User.find({token: token},function (err,user) {
        if(err)
        {
            return next(err)
        }
        else{
            Group.findOne({id : req.params.id}).populate('project').exec(function (err,group) {
                if(err)
                {
                    res.json(err)
                }
                if(group == null)
                {
                    res.status(404)
                    return res.json({
                        Group: "NotFound"
                    })
                }
                if(skip == -1)
                {
                    Message.find({group: group._id}).sort({created_at: 'descending'}).populate({
                        path: 'user',
                        select: '_id id username avatar'
                    }).exec(function (err,messages) {
                        if(err)
                        {
                            return next(err)
                        }
                        else{
                            let data = []
                            messages.forEach(message => {
                                data.push({
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
                            })
                            res.json(data)
                        }
                    })
                }
                else{
                    Message.paginate({group: group._id},{
                        sort: {
                            created_at: 'descending'
                        },
                        populate: {
                            path: 'user',
                            select: '_id id username avatar'
                        },
                        limit: 20,
                        page: skip
                    },function (err,messages) {
                        if(err)
                        {
                            return next(err)
                        }
                        else{
                            let data = []
                            messages = messages.docs
                            messages.forEach(message => {
                                data.push({
                                    id: message._id,
                                    userId: message.user.id,
                                    userName: message.user.username,
                                    message: message.content,
                                    messageText: message.contentText,
                                    time: message.created_at,
                                    type: message.type,
                                    userAvatar: message.user.avatar,
                                    location: message.location
                                })
                            })
                            return res.json(data)
                        }
                    })
                }
            })
        }
    })




})
router.post('/',function (req,res,next) {
    let members = []
    User.findOne({token: req.headers['auth-token']},function (err,user) {
        if(err)
        {
            return next(err)
        }
        else{
            members.push(user._id)
            let body = req.body
            body.members = members
            body.owner = user._id
            let group = new Group(body)
            group.save(function (err,doc) {
                if(err)
                {
                    return next(err)
                }
                else{
                    user.groups.push(group._id)
                    user.save(function (err) {
                        if(err)
                        {
                            return next(err)
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
            return next(err)
        }
        else{
            Group.findOne({id: req.params.id},function (err,group) {
                if(err)
                {
                    return next(err)
                }
                else{
                    group.members =  group.members.filter(mem => {
                        return !mem.equals(user._id)
                    })
                    group.save(function (err,doc) {
                        if(err)
                        {
                            return next(err)
                        }
                        else {
                            user.groups = user.groups.filter(item => {
                                return !item.equals(group._id)
                            })
                            user.save(function (err) {
                                if(err)
                                {
                                    return next(err)
                                }
                                else{
                                    if(group.members.length == 0)
                                    {
                                        Group.deleteOne({ id: group.id }, function (err) {
                                            if (err)
                                            {
                                                return next(err)
                                            }
                                            else{
                                                Message.deleteMany({group: Schema.Types.Object(group._id)},function (err) {
                                                    if(err)
                                                    {
                                                        return next(err)
                                                    }
                                                    else{
                                                        User.updateMany({groups: Schema.Types.Object(group._id)}, { $pullAll: {groups: [Schema.Types.Object(group._id)] } } ,function(err){
                                                            if(err)
                                                            {
                                                                return next(err)
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
