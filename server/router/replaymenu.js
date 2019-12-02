const app = require('express');
const router = app.Router();
const fs = require('fs');


router.route('/replaymenu')
    .get((req, res, next) => {
        fs.readdir('pdf/', function (err, files) {
            if (err) throw err;
            let fileList = files.filter(file => {
                return /.*\.(pdf$|PDF$)/.test(file);
            })
            res.render('./replay', { array: fileList });
        })
    })
    .post((req, res, next) => {
        let userName = req.body.userName;
        res.render('./replay', { userName: userName, pdfname: req.body.pdfname });
    })
router.post('/repMenu', (req, res, next) => {
    fs.readdir('pdf/', function (err, files) {
        if (err) throw err;
        let fileList = files.filter(file => {
            return /.*\.(pdf$|PDF$)/.test(file);
        })
        res.render('./replaymenu', { userName:req.body.userName,array: fileList });
    }) 
})
module.exports = router;