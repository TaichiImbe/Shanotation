const app = require('express');
const router = app.Router();
const fs = require('fs');

//index render
router.route('/index')
    .get((req, res, next) => {
        let userName = req.body.userName;
        res.render('./index', { pdfname: req.body.pdfname, userName: userName });
    })

module.exports = router;