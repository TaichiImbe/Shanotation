const app = require('express');
const router = app.Router();
const fs = require('fs');

router.route('/replay')
    .get((req, res, next) => {
        res.render('./replay', { title: 'リプレイ' });
    })
    .post((req, res, next) => {
        res.render('./replay', { title: 'リプレイ' });
    })
module.exports = router;