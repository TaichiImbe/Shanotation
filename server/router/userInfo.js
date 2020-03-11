let app = require('express');
let router = app.Router();
let fs = require('fs');
const mongodb = require('../mongodb');

router.route('/userInfo')
    .get((req, res, next) => {
        mongodb.FindOne('userInfo', { userName: req.query.id }, (result) => {
            res.render('./userInfopage', { title:'ユーザ情報',userName: result.userName, passWord: result.passWord, email: result.email });
        })
    })
    .post((req, res, next) => {
        mongodb.Update('userInfo',{userName:req.body.userName},{email:req.body.email})
        mongodb.Find('loginUser', { userName: req.query.id}, (result) => {
            if (result.length == 0) {
                mongodb.Insert('loginUser', [{ userName: req.query.id,time:Date.now()}])
            }
        });
        res.redirect('./main?id='+req.body.userName);
    })


module.exports = router;