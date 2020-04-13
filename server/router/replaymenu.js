const app = require('express');
const router = app.Router();
const fs = require('fs');

const menu = require('../../config/menu.json')

router.route('/replaymenu')
    .get((req, res, next) => {
        fs.readdir('pdf/', function (err, files) {
            if (err) throw err;
            let fileList = files.filter(file => {
                return /.*\.(pdf$|PDF$)/.test(file);
            })
            let menuItems = menu.menu;
            res.render('./replaymenu', { title:'リプレイ' ,userName:req.query.id,array: fileList ,menuItems:menuItems});
            // res.render('./replay', { array: fileList });
        })
    })
    .post((req, res, next) => {
        let userName = req.body.userName;
        res.render('./replay', { title:'リプレイ' ,userName: userName, pdfname: req.body.pdfname });
    })

module.exports = router;