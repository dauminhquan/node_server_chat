let express = require('express');
const Group = require('./../../model/Group')
const Project = require('./../../model/Project')
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

});
router.get('/:id',function (req,res,next) {
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
router.put('/:id/edit',function (req,res,next) {
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
router.use('/registration',require('./registration'))
module.exports = router;
