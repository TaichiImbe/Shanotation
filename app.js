var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var router = express.Router();
var url = require('url');
var config = require('config');

var port = config.port;
var user = config.user;

var os = require('os');
var hostname = os.hostname() || '127.0.0.1';

var fabric = require('fabric').fabric;
// var sock = require('./server/sock');
var socketIO = require('socket.io');
var io;
var server;
var filename;

//ファイル書き出し処理
var fileWrite = require('./server/fileio').fileWrite;

//分析処理
var analys = require('./server/analys');

//express server
server = app.listen(port, function () {
    console.log('Node js is listening to PORT:' + server.address().port);
});

//express session initialization
var sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
});

//parser
app.use(bodyParser.urlencoded({
    extended: true
}));

app.session = sessionMiddleware;
app.use(sessionMiddleware);
//__dirnameはapp.jsがあるところのまでのpathが通る
app.use('/js', express.static(__dirname + '/views/js'));
// pdfのリクエストがあった時のルーティング?
app.use('/pdf', express.static(__dirname + '/pdf'));
//nodeアプリケーションのリクエストルーティング
app.use('/node_modules', express.static(__dirname + '/node_modules'));
//main view
app.use('/views', express.static(__dirname + '/views'));
app.use('/css', express.static(__dirname + '/views/css'));

// webconfig path
app.use('/config',express.static(__dirname + '/config'))

app.set('view engine', 'ejs');

//login view
app.get('/', function (req, res, next) {
    // console.log(os.networkInterfaces().en0[1].address);
    res.render('./login');
});

//login setting
app.post('/', function (req, res, next) {
    // console.log(req.body);
    let userName = req.body.userName;
    if (userName === 'teacher') {
        res.redirect('/teacher');
    } else {
        res.redirect('/index');
    }
});

//index render
app.get('/index', function (req, res, next) {
    res.render('./index');
});
//pdf request
app.get('/pdf', function (req, res, next) {
    res.sendFile(req.url);
});

//teacher render
app.get('/teacher', function (req, res, next) {
    res.render('./teacher');
});

//login userList 
var userList = new Map();

//socket connect
io = socketIO.listen(server);

io.sockets.on('connection', function (socket) {
    // console.log('connection');
    var handshake = socket.handshake
    socket.on('massage', function (data) {
        console.log('massage');
        io.sockets.emit('massage', { value: data.value });
    });
    socket.on('userName', function (name) {
        socket.username = name;
        userList.set(handshake.address, name);
        // console.log(socket.username);
    })
    //object resive
    socket.on('object', function (data, oCoords, pageNum, ident,text,time) {
        if (data.type === 'path') {
            var path = data.path;
            analys.dataset(handshake.address, data, oCoords,pageNum,ident,text);
            analys.analys(pageNum);
            fileWrite('analysdata.txt', handshake,userList.get(handshake.address), data, pageNum,time);
            if (userList.get(handshake.address) != 'teacher') {
                io.sockets.emit('teacher', data, oCoords,pageNum,ident);
            }
        } else {
            console.log(data);
        }
    });

    socket.on('canvas', function (canvas) {
        console.log(canvas);
    });

    socket.on('disconnect', function (data) {
        // console.log('disconnect');
    });
});

io.use(function (socket, next) {
    // console.log(socket);
    // fileWrite(socket.request);
    sessionMiddleware(socket.request, socket.request.res, next);
});

module.exports = app;