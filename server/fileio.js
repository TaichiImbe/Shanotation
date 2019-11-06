var fs = require('fs');
// var filename = 'analysdatatest.txt';

/**
 *  ファイル出力処理
 *  datasの型がpathのときfabricのpathを1ポイントずつ分割して出力
 *  それ以外の時はfinenameに指定されたファイルにそのまま書き出す
 * @param {*} filename
 * @param {*} userName
 * @param {*} handshake
 * @param {*} datas
 * @param {*} time
 */
function fileWrite(filename, handshake, userName,datas,pageNum,time) {
    // console.log(datas.type);
    if (datas.type == 'path') {
        var data = datas.path;
        var array = new Array();
        str = '';
        var ip = handshake.address.split(":");
        for (i = 0; i < data.length; i++) {
            // array.push(userName + ' ' + data[i] + ' '+ time +'\n');
            str += userName + ' ' + data[i] + ' ' + pageNum +' '+time + '\n';
        }
        fs.open(filename, 'a', function (err, fd) {

            if (err) throw err;
            // if (data instanceof Array) {
            // for (i = 0; i < data.length; i++) {
            // console.log(i);
            // fs.appendFile(fd, handshake.address + " " + data[i] + '\n', 'utf8', function (err) {
            fs.appendFile(fd, str, 'utf8', function (err) {
                if (err) throw err;
                fs.close(fd, function (err) {
                    if (err) throw err;
                })
            });
        });
            // }
        // }
    } else {
        fs.open(filename, 'a', function (err, fd) {
            if (err) throw err;
            fs.appendFile(fd, datas, 'utf8', function (err) {
                fs.close(fd, function (err) {
                    if (err) throw err;
                })
            })
        })
    }

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