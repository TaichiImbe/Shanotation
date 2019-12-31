const app = require('express');
const router = app.Router();
const fs = require('fs');
const url = require('url');

//index render
router.route('/index')
    .get((req, res, next) => {
        const userName = req.query.id;
        const pdfname = req.query.pdfname;
        // let userName = req.body.userName;
        res.render('./index', { pdfname: pdfname, userName: userName });
    })

module.exports = router;