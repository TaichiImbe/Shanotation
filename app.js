const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const router = express.Router();
const url = require('url');
const config = require('config');

let port = config.port;
let user = config.user;

let os = require('os');
let hostname = os.hostname() || '127.0.0.1';

const fabric = require('fabric').fabric;
// var sock = require('./server/sock');
const socketIO = require('socket.io');
let io;
let server;
let filename;

// const passport = require('passport');
// let local = require('passport-local');

//ファイル書き出し処理
let fileio = require('./server/fileio');

//分析処理
const analys = require('./server/analys');

const route = require('./server/router/routes');
const main = require('./server/router/main');
const upload = require('./server/router/upload');
const index = require('./server/router/index');
const teacher = require('./server/router/teacher');
const replay = require('./server/router/replay');
const replaymenu = require('./server/router/replaymenu');

//express server
server = app.listen(port, function () {
    console.log('Node js is listening to PORT:' + server.address().port);
});


//express session initialization
let sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
});

//parser
app.use(bodyParser.urlencoded({
    extended: true
}));

// const socket_io_session = require('./server/socket.io_passport-session')(sessionMiddleware, passport);

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
app.use(route);
app.use(main);
app.use(upload);
app.use(index);
app.use(teacher);
app.use(replay);
app.use(replaymenu);

// app.use(passport.initialize());
// app.use(passport.session());
// let LocalStrategy = require('passport-local').Strategy;
// passport.use(
//     new LocalStrategy(
//     {
//         usernameField: 'userName',
//         passwordField: 'passWord'
//     },
//     (username, password, done) => {
//     if (username === "test" && password === "test") {
//         return done(null, username)
//     } else {
//       console.log("login error")
//         return done(null, false, { message: 'パスワードが正しくありません。' })
//     }
// }));

// passport.serializeUser(function(user, done) {
//     done(null, user);
// });
  
// passport.deserializeUser(function (user, done) {
//     done(err, user);
// });

// ファイルアップロード処理用
// app.use(fileupload());

//pdf request
app.get('/pdf', function (req, res, next) {
    res.sendFile(req.url);
});

//login userList 
let userList = new Map();

//socket connect
io = socketIO.listen(server);
// io.use(socket_io_session.express_session);
// io.use(socket_io_session.passport_initialize);
// io.use(socket_io_session.passport_session);

io.sockets.on('connection', function (socket) {
    //接続時にPrivateIPを設定する.
    var handshake = socket.handshake
    // userList.set(handshake.address);
    socket.on('massage', function (data) {
        console.log('massage');
        io.sockets.emit('massage', { value: data.value });
    });
    socket.on('userName', function (name, ip) {
        socket.username = name;
        userList.set(name, name);
        console.log(userList);
        // console.log(socket.username);
    })
    //object resive
    socket.on('object', function (name, data, color, oCoords, pageNum, ident, text, pdfName, time) {
        if (!userList.has(name)) {
            userList.set(name, name);
        }
        if (data.type === 'path') {
            let parser = new URL(socket.handshake.headers.referer);
            var path = data.path;
            analys.dataset(name, data, oCoords, pageNum, ident, text);
            // console.log(userList);
            // console.log(userList.size);
            let ptext = analys.analys(pageNum, userList.size);
            // let ptext = analys.analysOne(pageNum,text,userList.size);
            if (ptext == null) {
                console.log('err');
            }
            // console.log(ptext);
            if (parser.pathname === '/main') {
                fileio.fileWrite('analysdata.txt', handshake, name, data, color, pageNum, pdfName, 'insert', time);
            } else if (parser.pathname === '/replaymenu') {
                fileio.fileWrite('replay.txt', handshake, name, data, color, pageNum, pdfName, 'insert', time);
            }
            if (userList.get(handshake.address) != 'teacher') {
                io.sockets.emit('teacher', data, oCoords, pageNum, ident, ptext);
            }
        } else {
            // console.log(data);
        }
    });

    socket.on('annotation', (name, data, color, pageNum, pdfName, time) => {
        fileio.fileWrite('analysdata.txt', handshake, name, data, color, pageNum, pdfName, 'insert', time);
    })

    socket.on('canvas', function (canvas) {
        console.log(canvas);
    });

    socket.on('disconnect', function (data) {
        // console.log('disconnect');
    });

    socket.on('remove', function (name, obj, color, oCoords, pageNum, text, ident, pdfName, time) {
        let parser = new URL(socket.handshake.headers.referer);
        analys.dataRemove(name, obj, oCoords, pageNum, text);
        if (parser.pathname === '/main') {
            fileio.fileWrite('removedata.txt', handshake, name, obj, color, pageNum, pdfName, 'delete ', time);
        }else if (parser.pathname === '/replaymenu'){
            fileio.fileWrite('replay.txt', handshake, name, obj, color, pageNum, pdfName, 'delete', time);
        }
        let ptext = analys.analys(pageNum,userList.size);
        if (userList.get(handshake.address) != 'teacher') {
            io.sockets.emit('teacher', obj, oCoords,pageNum,ident,ptext);
        }
    });

    socket.on('clear', function (name, pageNum) {
        analys.dataClear(name, pageNum);
    })

    socket.on('reload', function (name) {
        if (!userList.has(name)) {
            userList.set(name, name);
        }
    });

    socket.on('limit', function (limit,pageNum) {
        analys.setLimit(limit);
        let ptext = analys.analys(pageNum,userList.size);
        io.sockets.emit('limit_set_teacher',pageNum,ptext);
    });

    socket.on('getdata', (userName) => {
        let datas = '';
        datas = fileio.getData('test.txt');
        // datas = fileio.getData('replaydata.txt');
        io.sockets.emit('replaydata', datas);
        // fileio.getData('analysdata.txt').then((readData) => {
            // datas = readData;
            // console.log(datas);
        // })

    })

    socket.on('pageTrans', (userName, ident, pageNum, pdfName, time)=>{
        fileio.pageTransInfo('pageTrans.txt',userName,ident, pageNum, pdfName, time);
    });
});

io.use(function (socket, next) {
    // console.log(socket);
    // fileWrite(socket.request);
    sessionMiddleware(socket.request, socket.request.res, next);
});

module.exports = app;