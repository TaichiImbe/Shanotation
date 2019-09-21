var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var route = express.Router();
var url = require('url');

var fabric = require('fabric').fabric;
var sock = require('./server/sock');
var server;

function serve(route, handle) {
    // if (server) {
    //     server.close(function () {
    //         // console.log('server is close');
    //     });
    // }
    server = app.listen(4000, function () {
        console.log('Node js is listening to PORT:' + server.address().port);
    });

    // server = spawn()

    app.use(bodyParser.urlencoded({
        extended: true
    }))
    //__dirnameはapp.jsがあるところのまでのpathが通る
    app.use('/js', express.static(__dirname + '/views/js'));
    // pdfのリクエストがあった時のルーティング?
    app.use('/pdf', express.static(__dirname + '/pdf'));

    app.use('/node_modules', express.static(__dirname + '/node_modules'));
    app.use('/views', express.static(__dirname + '/views'));
    app.use('/css', express.static(__dirname + '/views/css'));

    app.set('view engine', 'ejs');

    // // app.get('/js/.*\.js', function (req, res) {
    // //     console.log(req.url);
    // });
    // route.get('/', function (req, res, next) {
    //     res.sendFile(path.resolve('./' + req.url));
    // })

    app.get('/index', function (req, res, next) {
        // console.log(req.url);
        // console.log(req);
        // console.log(__dirname);
        sock.listen(req,res,server);
        res.render('./index', { fs: fs, fabric: fabric });
    });
    app.get('/pdf', function (req, res, next) {
        console.log(__dirname);
        console.log('pdf local load');
        res.sendFile(req.url); 
    });
    app.get('/teacher', function (req, res, next) {
        sock.listen(req, res, server);
        res.render('./teacher');
    })
    // app.post('/', (req, res) => {
    //     // console.log('POST');
    //     // console.log(req.body);
    //     res.render('./index', { fs: fs, fabric: fabric });
    // });

    
}
function rebuild() {
    
}

exports.serve = serve;