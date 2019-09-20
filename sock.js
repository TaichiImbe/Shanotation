
var socketIO = require('socket.io');
var io;

function listen(server) {

    io = socketIO.listen(server);
    io.sockets.on('connection', function (socket) {
        // console.log('connection');
        socket.on('massage', function (data) {
            console.log('massage');
            io.sockets.emit('massage', { value: data.value });
        });
        socket.on('object', function (data) {
            if (data.type === 'path') {
                console.log(data.path);
                console.log(data.left + " " + data.top);
                fs.open('Annolog.txt', 'a', function (err, fd) {

                    if (err) throw err;
                    fs.writeFileSync(fd, data.path + '\n', 'utf8', function (err) {
                        if (err) throw err;
                        fs.close(fd, function (err) {
                            if (err) throw err;
                        })
                    });
                });
            } else {

                console.log(data);
            }

        })
        socket.on('disconnect', function (data) {
            // console.log('disconnect');
        });
    });
}

exports.listen = listen;