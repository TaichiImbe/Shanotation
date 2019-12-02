let app = require('express');
let router = app.Router();
let fs = require('fs');

router.route('/login')
    .get((req, res, next) => {
        res.render('./login');
    })
    .post((req, res, next) => {
        res.redirect('./main');
    })

module.exports = router;