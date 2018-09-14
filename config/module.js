let modules = {};
const User = require('./../model/User')
modules.init = app => {
    const path = require('path');
    const cookieParser = require('cookie-parser');
    const logger = require('morgan');
    const bodyParser = require('body-parser');
    const express = require('express');
    const cors = require('cors')
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    var whitelist = ['http://localhost:8080']
    var openUrl = ['/login','/users/registration','/companies/registration']
    var corsOptions = {
        // origin: function (origin, callback) {
        //     console.log(origin)
        //     if (whitelist.indexOf(origin) !== -1) {
        //         callback(null, true)
        //     } else {
        //         callback(new Error('Not allowed by CORS'))
        //     }
        // }
    }
    app.use(cors(corsOptions))
    app.use(function(req, res, next) {
        if(openUrl.includes(req.originalUrl))
        {
            next()
        }
        else{
            let token = req.headers['auth-token']
            User.findOne({token: token},function (err,user) {
                if(err)
                {
                    return next(err)
                }
                else {
                    if(user == null)
                    {
                        res.status(403)
                        res.json({
                            auth: 'Auth Denied'
                        })
                    }
                    else {
                        next()
                    }
                }
            })
        }
    })
};

module.exports = modules;
