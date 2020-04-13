let app = require('express');
let router = app.Router();
let fs = require('fs');

const menu = require('../../config/menu.json')

router.route('/main')
    .get((req, res, next) => {
        fs.readdir('pdf/', function (err, files) {
            if (err) throw err;
            let fileList = files.filter(file => {
                return /.*\.(pdf$|PDF$)/.test(file);
            })
            let menuItems = menu.menu;
            res.render('./main', { title:'PDF選択',array: fileList ,userName:req.query.id ,menuItems:menuItems});
        })
    })
    .post((req, res, next) => {
        if (userName === 'teacher') {
            res.render('./teacher');
        } else {
            res.render('./index');
        }
    })
router.post('/pageTrans', (req, res, next) => {
    res.render('./upload', { userName: req.body.userName });
})
module.exports = router;