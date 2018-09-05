let express = require('express');
const Company = require('./../../model/Company')
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
module.exports = router;
