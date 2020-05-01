const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

const webconfig = require('./config/webconfig.json');

const port = webconfig.port;

// var sock = require('./server/sock');
const socketIO = require('socket.io');
let io;

//ファイル書き出し処理
const fileio = require('./server/fileio');

//データベース
const mongodb = require('./server/mongodb');

//分析処理
const analys = require('./server/analys');

const sock = require('./server/sock');

const route = require('./server/router/routes');
const main = require('./server/router/main');
const upload = require('./server/router/upload');
const index = require('./server/router/index');
const teacher = require('./server/router/teacher');
const replay = require('./server/router/replay');
const replaymenu = require('./server/router/replaymenu');
const login = require('./server/router/login');
const userInfo = require('./server/router/userInfo');
const annotationLog = require('./server/router/annotationLog');
const logout = require('./server/router/logout');

//express server
const server = app.listen(port, function () {
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
app.use(login);
app.use(userInfo);
app.use(annotationLog);
app.use(logout);

// ファイルアップロード処理用
// app.use(fileupload());

//pdf request
app.get('/pdf', function (req, res, next) {
    res.sendFile(req.url);
});

const mongourl = webconfig.mongoaddress;
mongodb.Connect(mongourl,'testdb');

//login userList 
let userList = new Map();

//socket connect
io = socketIO.listen(server);

io.sockets.on('connection', function (socket) {
    let parser = new URL(socket.handshake.headers.referer);
    console.log(parser.searchParams.get('id'));
    // try {
    //     mongodb.Insert('activeUser', [{userName:parser.searchParams.get('id')}], (docs) => {

    //     })
    // } catch (error) {
    //     console.log(error);
    // } finally {

    // }
    socket.on('massage', function (data) {
        console.log('massage');
        io.sockets.emit('massage', { value: data.value });
    });
    socket.on('userName', function (name, ip) {
        socket.username = name;
        userList.set(name, name);
        // console.log(socket.username);
    })
    //object resive
    socket.on('object', function (name, data, color, oCoords, pageNum, ident, text, pdfName, time) {
        // if (!userList.has(name) && parser.pathname.includes('/index')) {
        //     userList.set(name, name);
        // }
        mongodb.Find("activeUser", ({"userName":{"$ne":"teacher"}}), (docs) =>{
        if (data.type === 'path') {
            let parser = new URL(socket.handshake.headers.referer);
            var path = data.path;
            // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/includes
            if (parser.pathname.includes('/index')) {
                fileio.fileWrite('analysdata.txt', name, data, color, pageNum, pdfName, 'insert', time);
                mongodb.Insert('analys',[{userName:name,data:data,path:data.path,color:color,pageNum:pageNum,pdfName:pdfName,ident:'insert',time:time}]);
            } else if (parser.pathname.includes('/replay')) {
                fileio.fileWrite('replay.txt', name, data, color, pageNum, pdfName, 'insert', time);
            }
            analys.dataset(name, data, oCoords, pageNum, ident, text);
            // console.log(userList);
            // console.log(userList.size);
            let ptext = analys.analys(pageNum, docs.length);
            // let ptext = analys.analysOne(pageNum,text,userList.size);
            if (ptext == null) {
                console.log('err');
            }
            if (name !== 'teacher') {
                if (parser.pathname.includes('/index')) {
                    io.sockets.emit('teacher', ptext, pageNum);
                } else if (parser.pathname.includes('/replay')) {
                    io.sockets.emit('replayteacher', ptext, pageNum); 
                }
            }
            // console.log(ptext);
        } else {
            // console.log(data);
        }
        })
    });

    socket.on('annotation', (name, data, color, pageNum, pdfName, time) => {
        let parser = new URL(socket.handshake.headers.referer);
            if (parser.pathname.includes('/index')) {
                fileio.fileWrite('analysdata.txt', name, data, color, pageNum, pdfName, 'insert', time);
            } else if (parser.pathname.includes('/replay')) {
                fileio.fileWrite('replay.txt', name, data, color, pageNum, pdfName, 'insert', time);
            }
    })

    socket.on('canvas', function (canvas) {
        console.log(canvas);
    });

    socket.on('disconnect', function (data) {
        // console.log('disconnect');
    });

    socket.on('remove', function (name, obj, color, oCoords, pageNum, text, ident, pdfName, time) {
        mongodb.Find("activeUser", ({"userName":{"$ne":"teacher"}}), (docs) => {

        let parser = new URL(socket.handshake.headers.referer);
        if (parser.pathname.includes('/index')) {
            fileio.fileWrite('removedata.txt', name, obj, color, pageNum, pdfName, 'delete', time);
            mongodb.Insert('analys',[{userName:name,data:obj,color:color,pageNum:pageNum,pdfName:pdfName,ident:'delete',time:time}]);
        }else if (parser.pathname.includes('/replay')){
            fileio.fileWrite('replay.txt', name, obj, color, pageNum, pdfName, 'delete', time);
        }
        analys.dataRemove(name, obj, oCoords, pageNum, text);
        let ptext = analys.analys(pageNum,docs.length);
        if (name !== 'teacher') {
            if (parser.pathname.includes('/index')) {
                io.sockets.emit('teacher', ptext, pageNum);
            } else if (parser.pathname.includes('/replay')) {
                io.sockets.emit('replayteacher', ptext, pageNum); 
            }
        }
        })
    });

    socket.on('clear', function (name, pageNum) {
        analys.dataClear(name, pageNum);
    })

    socket.on('reload', function (name) {
        analys.dataClear(name);
        if (!userList.has(name)) {
            userList.set(name, name);
        }
    });

    socket.on('limit', function (limit,pageNum) {
        analys.setLimit(limit);
        let ptext = analys.analys(pageNum,userList.size);
        io.sockets.emit('limit_set_teacher',pageNum,ptext);
    });

    socket.on('getdata', (userName,pdfName,startTime,endTime,name) => {
        let datas = '';
        if (!name) {
            datas = fileio.getData('analysdata.txt',userName,pdfName,startTime,endTime);
        } else {
            datas = fileio.getData('analysdata.txt',userName,pdfName,startTime,endTime,name);
        }
        // datas = fileio.getData('replaydata.txt');
        io.sockets.emit('replaydata', datas);
        // fileio.getData('analysdata.txt').then((readData) => {
            // datas = readData;
            // console.log(datas);
        // })

    })

    socket.on('highlightReq', (pageNum) => {
        let ptext = analys.analys(pageNum, userList.size);
        io.sockets.emit('replayteacher', ptext,pageNum);
    })

    socket.on('pageTrans', (userName, ident, pageNum, pdfName, time) => {
        fileio.pageTransInfo('pageTrans.txt', userName, ident, pageNum, pdfName, time);
        mongodb.Insert('pagetrans', [{ 'userName': userName, 'ident': ident, 'ppage': parseInt(pageNum.split(' ')[0], 10), 'npage': parseInt(pageNum.split(' ')[1], 10), 'pdfName': pdfName, time: time }]);
    });

    socket.on('replayData', (name, data, color, oCoords, pageNum, ident, text, pdfName, time) => {
        if (!userList.has(name)) {
            userList.set(name, name);
        }
        analys.dataset(name, data, oCoords, pageNum, ident, text);
            let ptext = analys.analys(pageNum, userList.size);
            if (ptext == null) {
                console.log('err');
            }
        // if (name != teacher) {
            io.sockets.emit('replayteacher', ptext, pageNum);
        // }
            
    });
    socket.on('replayRemove', (name, obj, color, oCoords, pageNum, text, ident, pdfName, time) => {
        analys.dataRemove(name, obj, oCoords, pageNum, text);
        let ptext = analys.analys(pageNum,userList.size);
        // if (name != 'teacher') {
                io.sockets.emit('replayteacher', ptext, pageNum); 
        // }
    })

    socket.on('teacherSelection',(name,pageNum,text,pdfName)=> {
        // analys.setTeacherSelection(true);
        // analys.textset(text,pageNum);
    })

    // socket.on('disconnect', (reason) => {
    //     let parser = new URL(socket.handshake.headers.referer);
    //     mongodb.FindOne('activeUser', { userName: parser.searchParams.get('id') }, (docs) => {
    //         try {
    //             mongodb.Insert('userLog', [{ userName:docs.userName,time:docs.time }], (docs) => {

    //             });
    //             mongodb.Delete('activeUser', { userName: parser.searchParams.get('id') }, (docs) => {

    //                 mongodb.Find('activeUser', { }, (docs) => {
    //                     if (docs.length === 0) {
    //                         //分析用の蓄積データを削除する
    //                     }

    //                 });
    //             });
    //         } catch (error) {
    //             console.log(error); 
    //         } finally {
                
    //         }
    //     })
        // console.log(parser.searchParams.get('id'));
        // console.log('disconnect');
        // console.log(socket.request)
        // socket.disconnect(true);
    // })
});

io.set('heartbeat interval', 5000);

io.set('heartbeat timeout', 15000);

io.use(function (socket, next) {
    // console.log(socket);
    // fileWrite(socket.request);
    sessionMiddleware(socket.request, socket.request.res, next);
});
