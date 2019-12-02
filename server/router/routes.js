let app = require('express');
let router = app.Router();
let fs = require('fs');

router.route('/')
    .get((req, res, next) => {
        res.redirect('./login');
        // res.render('./login');
    })
    .post((req, res, next) => {
        // res.redirect('./main');
        // fs.readdir('pdf/', (err, files) => {
        //     if (err) throw err;
        //     let userName = req.body.userName;
        //     let fileList = files.filter(file => {
        //         return /.*\.(pdf$|PDF$)/.test(file);
        //     });
        //     req.session.userName = userName;
            // console.log(req.session)
            // res.render('./main', { array: fileList, userName: userName });
    //    }) 
    })

module.exports = router;