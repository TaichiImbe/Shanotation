const app = require('express');
const router = app.Router();
const fs = require('fs');

const menu = require('../../config/menu.json')
//teacher render
router.route('/teacher')
    .get((req, res, next) => {
        let menuItems = menu.menu;
        res.render('./teacher', { title:'先生側',userName:req.query.id,pdfname:req.query.pdfname,menuItems:menuItems});
    })

module.exports = router;