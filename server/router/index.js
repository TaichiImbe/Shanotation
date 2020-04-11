const app = require('express');
const router = app.Router();
const fs = require('fs');
const url = require('url');

//index render
router.route('/index')
    .get((req, res, next) => {
        // let userName = req.body.userName;
        res.render('./index', {title:'学習者側'});
    })

module.exports = router;