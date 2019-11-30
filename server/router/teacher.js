const app = require('express');
const router = app.Router();
const fs = require('fs');

//teacher render
router.route('/teacher')
    .get((req, res, next) => {
        let userName = req.body.userName;
        res.render('./teacher', { pdfname: req.body.pdfname, userName: userName });
    })

module.exports = router;