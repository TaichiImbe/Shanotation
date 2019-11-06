var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var router = express.Router();
var url = require('url');
var config = require('config');
var multer = require('multer');

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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'')
    },

    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
})
var upload = multer({dest: './pdf/'}).single('thumbnail');

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
        // res.redirect('/teacher');
        res.render('./teacher');
    } else {
        res.render('./index',{userName: userName});
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

app.get('/upload', function (req, res, next) {
    res.render('./upload');
});

//todo upload処理でpdfがエラーする問題を解決する.
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.send("Failed to write " + req.file.destination + " with " + err);
        } else {
            req.send('uploaded' + req.file.originalname + ' as ' + req.file.filename + " Size: ")
        }
    });
});

//login userList 
var userList = new Map();

//socket connect
io = socketIO.listen(server);

io.sockets.on('connection', function (socket) {
    // console.log('connection');
    //接続時にPrivateIPを設定する.
    var handshake = socket.handshake
    // userList.set(handshake.address);
    socket.on('massage', function (data) {
        console.log('massage');
        io.sockets.emit('massage', { value: data.value });
    });
    socket.on('userName', function (name,ip) {
        socket.username = name;
        userList.set(name, name);
        console.log(userList);
        // console.log(socket.username);
    })
    //object resive
    socket.on('object', function (name,data, oCoords, pageNum, ident,text,time) {
        if (data.type === 'path') {
            var path = data.path;
            analys.dataset(name, data, oCoords,pageNum,ident,text);
            // console.log(userList);
            // console.log(userList.size);
            let ptext = analys.analys(pageNum,userList.size);
            // let ptext = analys.analysOne(pageNum,text,userList.size);
            if (ptext == null) {
                console.log('err');
            }
            // console.log(ptext);
            fileWrite('analysdata.txt', handshake,name, data, pageNum,time);
            if (userList.get(handshake.address) != 'teacher') {
                io.sockets.emit('teacher', data, oCoords,pageNum,ident,ptext);
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

    socket.on('remove',function(name,obj,oCoords,pageNum,text,ident){
        console.log('remove');
        analys.dataRemove(userList.get(name),obj,oCoords,pageNum,text);
        let ptext = analys.analys(pageNum,userList.size);
        if (userList.get(handshake.address) != 'teacher') {
            io.sockets.emit('teacher', obj, oCoords,pageNum,ident,ptext);
        }
    });

    socket.on('clear', function (name, pageNum) {
        console.log('clear');
        analys.dataClear(name, pageNum);
    })
});

io.use(function (socket, next) {
    // console.log(socket);
    // fileWrite(socket.request);
    sessionMiddleware(socket.request, socket.request.res, next);
});

module.exports = app;