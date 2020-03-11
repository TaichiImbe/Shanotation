let app = require('express');
let router = app.Router();
let fs = require('fs');
const mongodb = require('../mongodb');
const util = require('../util/util');

router.route('/login')
    .get((req, res, next) => {
        res.render('./login',{title:'ログイン'})
    })
    .post((req, res, next) => {
        req.session.userName = req.body.userName;
        mongodb.Insert('loginUser', [{ userName: req.body.userName,time:util.getNowTime()}])
        res.redirect('./main?id='+req.body.userName);
    })


module.exports = router;