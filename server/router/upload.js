const app = require('express');
const router = app.Router();
const fs = require('fs');
const multer = require('multer');
const url = require('url');

const menu = require('../../config/menu.json')
//ファイルパスの設定のファイル名の設定
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'pdf')
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
//アップロードした後の諸々の処理はmulterに任せる
let upload = multer({ storage: storage });

//todo upload後の表示処理を考える
router.route('/upload')
    .get((req, res, next) => {
        let menuItems = menu.menu;
        res.render('./upload',{title:'データアップロード',userName:req.query.id,menuItems:menuItems});
    })
    .post(upload.single('myFile'), (req, res, next) => {
        var img = fs.readFileSync(req.file.path);
        fs.readdir('pdf/', function (err, files) {
            if (err) throw err;
            let fileList = files.filter(file => {
                return /.*\.(pdf$|PDF$)/.test(file);
            })
            let query = url.parse(req.headers.referer,true).query;
            // console.log(query);
            // res.redirect('back');
            res.redirect('/main?id='+query.id);
            // res.render('./main', { array: fileList, userName: req.body.userName });
        })
    })

module.exports = router;