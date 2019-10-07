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

var fileWrite = require('./server/fileio').fileWrite;

var analys = require('./server/analys');

server = app.listen(port, function () {
    console.log('Node js is listening to PORT:' + server.address().port);
});
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
    // console.log(os.networkInterfaces().en0[1].address);
    res.render('./login');
});

app.post('/', function (req, res, next) {
    // console.log(req.body);
    let userName = req.body.userName;
    if (userName === 'teacher') {
        res.redirect('/teacher');
    } else {
        res.redirect('/index');
    }
    // if (userName === 'student') {
    //     // req.session.user = { name: req.body.userName };
    //     res.redirect('/index');
    // } else if (userName === 'teacher') {
    //     // req.session.user = { name: req.body.userName };
    //     res.redirect('/teacher');
    // }else {
    //     var err = '入力が正しくありません.'
    //     res.render('/login', { error: err });
    // }
});

app.get('/index', function (req, res, next) {
    var ip = os.networkInterfaces().en0[1].address;
    res.render('./index', {ip : ip});
});
app.get('/pdf', function (req, res, next) {
    console.log(__dirname);
    console.log('pdf local load');
    res.sendFile(req.url);
});
app.get('/teacher', function (req, res, next) {
    res.render('./teacher');
})

var userList = new Map();
io = socketIO.listen(server);
io.sockets.on('connection', function (socket) {
    // console.log('connection');
    var handshake = socket.handshake;
    socket.on('massage', function (data) {
        console.log('massage');
        io.sockets.emit('massage', { value: data.value });
    });
    socket.on('userName', function (name) {
        socket.username = name;
        userList.set(handshake.address, name);
        // console.log(socket.username);
    })
    socket.on('object', function (data,oCoords,pageNum,time) {
        if (data.type === 'path') {
            // console.log(time);
            // console.log(data);
            var path = data.path;
            // console.log(oCoords);
            // console.log(pageNum);
            // console.log(socket.username);
            analys.dataset(handshake.address, data);
            fileWrite('analysdata.txt',handshake, data,time);
            if (userList.get(handshake.address) != 'teacher') {
                // console.log('send teacher');
                io.sockets.emit('teacher', data,pageNum);
            }
        } else {
            console.log(data);
        }
    })
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