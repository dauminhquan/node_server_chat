let express = require('express');
const Company = require('./../../model/Company')
const User = require('./../../model/User')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let router = express.Router();
router.get('/', function(req, res, next) {

    Company.find({},function (err,docs) {
        if(err)
        {
            res.json(err)
        }
        else{
            res.json(docs)
        }
    })

});
router.post('/registration',function (req,res,next) {
    var company = new Company(req.body)
    company.save(function (err,info) {
        if(err)
        {
            res.json(err)
        }
        else{
            res.json(info)
        }
    })
})
router.get('/members',function (req,res,next) {
    let token = req.headers['auth-token']
    User.findOne({token: token},function (err,user) {
        if(err)
        {
            next(err)
        }
        else {
            Company.findById(user.company).populate({
                path: 'members',
                select: '_id id username avatar'
            }).exec(function (err,company) {
                if(err)
                {
                    return next(err)
                }
                else{
                    return res.json({
                        members: company.members
                    })
                }
            })
        }
    })
})
module.exports = router;
