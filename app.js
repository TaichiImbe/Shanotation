var socketIO = require('socket.io');
var http = require('http');

var app = require('./server');

var fileWrite = require('./server/fileio').fileWrite;

var analys = require('./server/analys');

// var port = '4000';
// app.set('port', port);

// var server = http.createServer(app);
server = app.listen(4000, function () {
    console.log('Node js is listening to PORT:' + server.address().port);
});

var sessionMiddleware = app.session;

io = socketIO.listen(server);
io.sockets.on('connection', function (socket) {
    console.log(socket.request);
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
            analys.dataset(handshake.address, data);
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
