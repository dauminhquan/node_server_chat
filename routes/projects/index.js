let express = require('express');
const Project = require('./../../model/Project')
const Company = require('./../../model/Company')
const User = require('./../../model/User')
let router = express.Router();
router.get('/', function(req, res, next) {

    Project.find({},function (err,docs) {
        if(err)
        {
            res.json(err)
        }
        else{
            res.json(docs)
        }
    })

});
router.get('/info/:id/',function (req,res,next) {
    Project.findOne({id : req.params.id}).exec(function (err,doc) {
        if(err){
            res.json(err)
        }
        else{
            res.json(doc)
        }
    })
})
router.put('/:id/edit',function (req,res,next) {
    Project.findOne({id : req.params.id}).exec(function (err,doc) {
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
    User.findOne({token: req.headers['auth-token']},function (err,user) {
        if(err)
        {
            next(err)
        }
        else{
            let body = req.body
            body.members = []
            body.members.push(user._id)
            let project = new Project(body)
            project.save(function (err,info) {
                if(err)
                {
                    res.status(500)
                    res.json(err)
                }
                else{
                    Company.findById(req.body.company,function (err,doc) {
                        if(err)
                        {
                            res.status(500)
                            res.json(err)
                        }
                        else {
                            doc.projects.push(info._id)
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
        }
    })
})
module.exports = router;
