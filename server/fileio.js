var fs = require('fs');
var filename = 'analysdatatest.txt';

function fileWrite(handshake, data) {
    var array = new Array();
    for (i = 0; i < data.length; i++){
        var ip = handshake.address.split(":");
        array.push(ip[3]+' '+ data[i] +'\n'); 
    }
    fs.open(filename, 'a', function (err, fd) {

        if (err) throw err;
        // if (data instanceof Array) {
            // for (i = 0; i < data.length; i++) {
                // console.log(i);
                // fs.appendFile(fd, handshake.address + " " + data[i] + '\n', 'utf8', function (err) {
                fs.appendFile(fd, array , 'utf8', function (err) {
                    if (err) throw err;
                    fs.close(fd, function (err) {
                        if (err) throw err;
                    })
                });
            // }
        // }
    });

}

function writeData(data) {
    return new Promise(function (fullfill, reject) {
        
    });
    fs.open(filename, 'a', function (err, fd) {

        if (err) throw err;
        // if (data instanceof Array) {
            // for (i = 0; i < data.length; i++) {
                // console.log(i);
                // fs.appendFile(fd, handshake.address + " " + data[i] + '\n', 'utf8', function (err) {
                fs.appendFile(fd, handshake.address + " " + data + '\n', 'utf8', function (err) {
                    if (err) throw err;
                    fs.close(fd, function (err) {
                        if (err) throw err;
                    })
                });
            // }
        // }
    });
}

exports.fileWrite = fileWrite;