const app = require('express');
const router = app.Router();
const fs = require('fs');

//teacher render
router.route('/teacher')
    .get((req, res, next) => {
        res.render('./teacher', { title:'先生側'});
    })

module.exports = router;