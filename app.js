var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var router = express.Router();
var url = require('url');

var fabric = require('fabric').fabric;
// var sock = require('./server/sock');
var socketIO = require('socket.io');
var io;
var server;
var filename;

var fileWrite = require('./server/fileio').fileWrite;

var analys = require('./server/analys');

// function serve(route, handle) {
// if (server) {
//     server.close(function () {
//         // console.log('server is close');
//     });
// }
server = app.listen(4000, function () {
    console.log('Node js is listening to PORT:' + server.address().port);
});
var sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
});
// server = spawn()

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

// // app.get('/js/.*\.js', function (req, res) {
// //     console.log(req.url);
// });
// route.get('/', function (req, res, next) {
//     res.sendFile(path.resolve('./' + req.url));
// })

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
    // console.log(req.url);
    // console.log(req);
    // console.log(__dirname);
    // sock.listen(req, res, server);

    res.render('./index', { fs: fs, fabric: fabric });
});
app.get('/pdf', function (req, res, next) {
    console.log(__dirname);
    console.log('pdf local load');
    res.sendFile(req.url);
});
app.get('/teacher', function (req, res, next) {
    // sock.listen(req, res, server);
    res.render('./teacher');
})
// app.post('/', (req, res) => {
//     // console.log('POST');
//     // console.log(req.body);
//     res.render('./index', { fs: fs, fabric: fabric });
// });
io = socketIO.listen(server);
// console.log(req.ip);
io.sockets.on('connection', function (socket) {
    // console.log('connection');
    var handshake = socket.handshake;
    socket.on('massage', function (data) {
        console.log('massage');
        io.sockets.emit('massage', { value: data.value });
    });
    socket.on('AXT', function (data) {
        console.log(socket.userName);
        // fileWrite('handshake.txt', handshake, handshake);
    });
    socket.on('object', function (data,time) {
        if (data.type === 'path') {
            console.log(time);
            console.log(data.path.length);
            var path = data.path;
            // console.log(data.left + " " + data.top);
            // console.log(data);
            analys.dataset(handshake.address, data);
            // for (i = 0; i < path.length; i++){
                // console.log(path[i]);
                // fileWrite(handshake, path[i]);
            // }
            fileWrite('analysdata.txt',handshake, data.path);
            io.sockets.emit('teacher', data);
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

// function fileWrite(handshake, data) {
//     fs.open(filename, 'a', function (err, fd) {

//         if (err) throw err;
//         // if (data instanceof Array) {
//             // for (i = 0; i < data.length; i++) {
//                 // console.log(i);
//                 // fs.appendFile(fd, handshake.address + " " + data[i] + '\n', 'utf8', function (err) {
//                 fs.appendFile(fd, handshake.address + " " + data + '\n', 'utf8', function (err) {
//                     if (err) throw err;
//                     fs.close(fd, function (err) {
//                         if (err) throw err;
//                     })
//                 });
//             // }
//         // }
//     });

// }

// }

// exports.serve = serve;
module.exports = app;