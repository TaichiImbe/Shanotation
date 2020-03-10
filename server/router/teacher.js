const app = require('express');
const router = app.Router();
const fs = require('fs');

//teacher render
router.route('/teacher')
    .get((req, res, next) => {
        const userName = req.query.id;
        const pdfname = req.query.pdfname; 
        res.render('./teacher', { title:'先生側', pdfname: pdfname, userName: userName });
    })

module.exports = router;