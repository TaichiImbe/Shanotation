const app = require('express');
const router = app.Router();
const fs = require('fs');

router.route('/replay')
    .get((req, res, next) => {
        res.render('./replay', { userName: req.body.userName ,pdfname:'imageprossesing6.pdf'});
    })
module.exports = router;