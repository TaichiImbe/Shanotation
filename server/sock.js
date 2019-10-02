
var socketIO = require('socket.io');
var fs = require('fs');
var io;
var filename;
var ip;

var fileWrite = require('./fileio').fileWrite;

var analys = require('./analys');

// var sessionMiddleware = session({
//     secret: 'secret',
//     resave: false,
//     saveUninitilized: false,
//     cookie: { secure: true }
// });

function listen(app,server) {

    io = socketIO.listen(server);
    io.sockets.on('connection', function (socket) {
        // console.log('connection');
        var handshake = socket.handshake;
        socket.on('massage', function (data) {
            console.log('massage');
            io.sockets.emit('massage', { value: data.value });
        });
        socket.on('object', function (data) {
            if (data.type === 'path') {
                // console.log(data.path);
                // console.log(data.left + " " + data.top);
                // console.log(data);
                fileWrite('analysdata.txt',handshake,data);
            } else {

                console.log(data);
            }

        })
        socket.on('disconnect', function (data) {
            // console.log('disconnect');
        });
    });
    io.use(function (socket, next) {
        app.session(socket.request, socket.request.res, next);
        // sessionMiddleware(socket.request, socket.request.res, next);
    })
}


exports.listen = listen;
// exports.sessionMiddleware = sessionMiddleware;