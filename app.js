const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const router = express.Router();
const url = require('url');
const config = require('config');
const multer = require('multer');

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
let analys = require('./server/analys');

//express server
server = app.listen(port, function () {
    console.log('Node js is listening to PORT:' + server.address().port);
});

//ファイルパスの設定のファイル名の設定
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'pdf')
    },

    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
})
//アップロードした後の諸々の処理はmulterに任せる
let upload = multer({storage:storage});

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

app.set('view engine', 'ejs');

//login view
app.get('/', function (req, res, next) {
    // console.log(os.networkInterfaces().en0[1].address);
//     res.redirect('./login');
// });

//login setting
// app.post('/', function (req, res, next) {
//     // console.log(req.body);
//     fs.readdir('pdf/', function (err, files) {
//         if (err) throw err;
//         let userName = req.body.userName;
//         let fileList = files.filter(file => {
//             return /.*\.(pdf$|PDF$)/.test(file);
//         })
//         // res.render('./main', {array: fileList});
//         res.render('./main', { array:fileList, userName: userName });
//     })
// });

// app.get('/login', function (req, res, next) {
    res.render('./login');
});

app.post('/', function (req, res, next) {
    // console.log(req.body);
    fs.readdir('pdf/', function (err, files) {
        if (err) throw err;
        let userName = req.body.userName;
        let fileList = files.filter(file => {
            return /.*\.(pdf$|PDF$)/.test(file);
        })
        // res.render('./main', {array: fileList});
        res.render('./main', { array:fileList, userName: userName });
    })
});
// app.post('/login', (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//         if (err) { return next(err); }
//         if (!user) { return res.redirect('/login'); }
//         req.logIn(user, (err) => {
//             if (err) { return next(err); }
//             console.log(user);
//             return res.redirect('/main');
//         });
//     })(req, res, next);
// });
// app.post('/login', passport.authenticate('local', {
//         successRedirect:'/main',
//         failureRedirect:'/login',
//         session:true
//     }
// ));

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
    console.log(req.body);
    res.render('./upload');
});

app.route('/main')
    .get(function (req, res, next) {
        // console.log(req.session.passport.user);
        fs.readdir('pdf/', function (err, files) {
            if (err) throw err;
            let fileList = files.filter(file => {
                return /.*\.(pdf$|PDF$)/.test(file);
            })
            res.render('./main', { array: fileList });
        })
    }).post(function (req, res, next) {
        let userName = req.body.userName;
        // res.render('./index', { pdfname: req.body.pdfname , userName:req.body.userName});
        if (userName === 'teacher') {
            // res.redirect('/teacher');
            res.render('./teacher', { pdfname: req.body.pdfname, userName: userName });
        } else {
            res.render('./index', { pdfname: req.body.pdfname, userName: userName });
        }
    });

app.post('/pageTrans', function (req, res, next) {
    res.render('./upload',{userName:req.body.userName});
});

//todo upload後の表示処理を考える
app.post('/upload', upload.single('myFile'), (req, res,next) => {
    var img = fs.readFileSync(req.file.path);
    fs.readdir('pdf/', function (err, files) {
        if (err) throw err;
        let fileList = files.filter(file => {
            return /.*\.(pdf$|PDF$)/.test(file);
        })
        res.render('./main', { array:fileList, userName: req.body.userName });
    })
    // res.redirect('./main');
});

app.get('/replay', (req, res, next) => {
    res.render('./replay', { userName: req.body.userName ,pdfname:'imageprossesing6.pdf'});
})

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
    socket.on('userName', function (name,ip) {
        socket.username = name;
        userList.set(name, name);
        console.log(userList);
        // console.log(socket.username);
    })
    //object resive
    socket.on('object', function (name,data,canvas, oCoords, pageNum, ident,text,pdfName,time) {
        if (!userList.has(name)) {
            userList.set(name,name);
        }
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
            fileio.fileWrite('analysdata.txt', handshake,name,data,canvas, pageNum,pdfName,'insert',time);
            if (userList.get(handshake.address) != 'teacher') {
                io.sockets.emit('teacher', data, oCoords,pageNum,ident,ptext);
            }
        } else {
            console.log(data);
        }
    });

    socket.on('annotation', (name, data, canvas, pageNum, pdfName,time)=>{
        fileio.fileWrite('analysdata.txt', handshake,name,data,canvas, pageNum,pdfName,'insert',time);
    })

    socket.on('canvas', function (canvas) {
        console.log(canvas);
    });

    socket.on('disconnect', function (data) {
        // console.log('disconnect');
    });

    socket.on('remove',function(name,obj,oCoords,pageNum,text,ident,pdfName,time){
        analys.dataRemove(userList.get(name),obj,oCoords,pageNum,text);
        fileio.fileWrite('analysdata.txt', handshake,name, obj, pageNum,pdfName,'delete',time);
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
        datas = fileio.getData('analysdata.txt');
        io.sockets.emit('replaydata', datas);
        // fileio.getData('analysdata.txt').then((readData) => {
            // datas = readData;
            // console.log(datas);
        // })

    })
});

io.use(function (socket, next) {
    // console.log(socket);
    // fileWrite(socket.request);
    sessionMiddleware(socket.request, socket.request.res, next);
});

module.exports = app;