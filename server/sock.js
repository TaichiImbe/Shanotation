
var socketIO = require('socket.io');
var fs = require('fs');
var io;
var filename;

function listen(req, res, server) {

    io = socketIO.listen(server);
    console.log(req.ip);
    filename = req.ip.toString() + 'analysdata.txt';
    io.sockets.on('connection', function (socket) {
        // console.log('connection');
        socket.on('massage', function (data) {
            console.log('massage');
            io.sockets.emit('massage', { value: data.value });
        });
        socket.on('object', function (data) {
            if (data.type === 'path') {
                // console.log(data.path);
                // console.log(data.left + " " + data.top);
                console.log(data);
                fileWrite(data);
            } else {

                console.log(data);
            }

        })
        socket.on('disconnect', function (data) {
            // console.log('disconnect');
        });
    });
    io.use(function (socket, next) {
        // app.session(socket.request, socket.request.res, next);
    })
}

function fileWrite(data) {
    fs.open(filename, 'a', function (err, fd) {

        if (err) throw err;
        fs.writeFileSync(fd, data + '\n', 'utf8', function (err) {
            if (err) throw err;
            fs.close(fd, function (err) {
                if (err) throw err;
            })
        });
    });

}

exports.listen = listen;