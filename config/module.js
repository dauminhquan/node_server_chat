let modules = {};
modules.init = app => {
    const path = require('path');
    const cookieParser = require('cookie-parser');
    const logger = require('morgan');
    const bodyParser = require('body-parser');
    const express = require('express');
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(function(req, res, next) {
        // res. header("Access-Control-Allow-Headers", "*");
        // console.log(req)

        // req.header("Access-Control-Allow-Headers", "Auth-Token");
        // res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
        // res.header('Access-Control-Request-Method','GET, POST, PUT, HEAD, DELETE')
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth-Token");
        // res.header('Access-Control-Request-Method','GET, POST, PUT, HEAD, DELETE')
        next();
    })
};

module.exports = modules;