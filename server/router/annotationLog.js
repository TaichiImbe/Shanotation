const app = require('express');
const router = app.Router();
const fs = require('fs');
const url = require('url');
const mongo = require('../mongodb');

router.route('/annotationLog')
    .get((req, res, next)=>{
        mongo.Find('analys', ({ 'pdfName': req.query.pdfname, 'ident':'insert'}), (result) => {
            res.render('annotationLog', {title:'書き込み一覧' ,annotationList : result });
        })
    })
    .post((req, res, next) => {

    })

module.exports = router;