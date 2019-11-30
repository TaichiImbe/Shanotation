const app = require('express');
const router = app.Router();



let socketIO = require('socket.io');
let fs = require('fs');
let io;
let filename;
let ip;

let fileWrite = require('./fileio').fileWrite;

let analys = require('./analys');

// express session initialization
var sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitilized: false,
    cookie: { secure: true }
});

router.session = sessionMiddleware;

function listen(app,server) {

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
}


exports.listen = listen;
// exports.sessionMiddleware = sessionMiddleware;