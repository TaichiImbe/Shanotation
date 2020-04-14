const app = require('express');
const router = app.Router();
const fs = require('fs');
const mongodb = require('../mongodb');
const util = require('../util/util');


router.route('/login')
    .get((req, res, next) => {
        res.render('./login',{title:'ログイン'})
    })
    .post((req, res, next) => {
        req.session.userName = req.body.userName;
        // mongodb.Insert('loginUser', [{ userName: req.body.userName,time:util.getNowTime()}])
        mongodb.Insert('activeUser', [{ userNmae: req.body.userName }], (docs) => {
            res.redirect('./main?id='+req.body.userName);
        })
    })


module.exports = router;