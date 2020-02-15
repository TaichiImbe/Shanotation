let app = require('express');
let router = app.Router();
let fs = require('fs');
const mongodb = require('../mongodb');

router.route('/login')
    .get((req, res, next) => {
        res.render('./login')
    })
    .post((req, res, next) => {
        req.session.userName = req.body.userName;
        mongodb.Find('loginUser', { userName: req.body.userName}, (result) => {
                mongodb.Insert('loginUser', [{ userName: req.body.userName }])
        });
        res.redirect('./main?id='+req.body.userName);
    })


module.exports = router;