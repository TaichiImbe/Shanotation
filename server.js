var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var router = express.Router();
var url = require('url');

var fabric = require('fabric').fabric;

// var analys = require('./server/analys');

// server = app.listen(4000, function () {
    // console.log('Node js is listening to PORT:' + server.address().port);
// });
var sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.session = sessionMiddleware;
app.use(sessionMiddleware);
//__dirnameはapp.jsがあるところのまでのpathが通る
app.use('/js', express.static(__dirname + '/views/js'));
// pdfのリクエストがあった時のルーティング?
app.use('/pdf', express.static(__dirname + '/pdf'));

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/views', express.static(__dirname + '/views'));
app.use('/css', express.static(__dirname + '/views/css'));

app.set('view engine', 'ejs');

app.get('/', function (req, res, next) {
    res.render('./login');
});

app.post('/', function (req, res, next) {
    console.log(req.body);
    let userName = req.body.userName;
    if (userName === 'student') {
        req.session.user = { name: req.body.userName };
        res.redirect('/index');
    } else if (userName === 'teacher') {
        req.session.user = { name: req.body.userName };
        res.redirect('/teacher');
    }else {
        var err = '入力が正しくありません.'
        res.render('/login', { error: err });
    }
});

app.get('/index', function (req, res, next) {

    res.render('./index');
});
app.get('/pdf', function (req, res, next) {
    console.log(__dirname);
    console.log('pdf local load');
    res.sendFile(req.url);
});
app.get('/teacher', function (req, res, next) {
    res.render('./teacher');
})

module.exports = app;