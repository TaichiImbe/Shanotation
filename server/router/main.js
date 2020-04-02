let app = require('express');
let router = app.Router();
let fs = require('fs');

router.route('/main')
    .get((req, res, next) => {
        fs.readdir('pdf/', function (err, files) {
            if (err) throw err;
            let fileList = files.filter(file => {
                return /.*\.(pdf$|PDF$)/.test(file);
            })
            res.render('./main', { title:'PDF選択',array: fileList ,userName:req.query.id });
        })
    })
    .post((req, res, next) => {
        let userName = req.body.userName;
        if (userName === 'teacher') {
            res.render('./teacher', { pdfname: req.body.pdfname, userName: userName });
        } else {
            res.render('./index', { pdfname: req.body.pdfname, userName: userName });
        }
    })
router.post('/pageTrans', (req, res, next) => {
    res.render('./upload', { userName: req.body.userName });
})
module.exports = router;