const app = require('express');
const router = app.Router();
const fs = require('fs');
const mongo = require('../mongodb'); 

router.route('/logout')
    .get((req, res, next) => {
        mongo.Delete('activeUser', { userName: req.params.id }, (docs) => {
            res.redirect('/login')
        })
    })

module.exports = router
