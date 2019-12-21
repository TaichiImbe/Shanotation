let fs = require('fs');
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
function fileWrite(filename, handshake, userName,path,color,pageNum,pdfName,ident,time) {
    // console.log(datas.type);
    if (path.type == 'path') {
        let data = path.path;
        let array = new Array();
        let ip = handshake.address.split(":");
        let str = userName + ' ' + data + ' ' + color +' '+ pageNum + ' ' + pdfName+ ' '+ident+' '+time + '\n';
        // let str = ''; 
        // for (i = 0; i < data.length; i++) {
            // array.push(userName + ' ' + data[i] + ' '+ time +'\n');
            // str += userName + ' ' + data[i] + ' ' + color+ ' '+ pageNum +' '+ pdfName + ' '+ ident + ' ' + time + '\n';
        // }
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
            fs.appendFile(fd, path, 'utf8', function (err) {
                fs.close(fd, function (err) {
                    if (err) throw err;
                })
            })
        })
    }

}

function pageTransInfo(filename, userName, ident, pageNum, pdfName, time) {
    let str = userName + ' ' + ident + ' ' + pageNum + ' ' + pdfName + ' ' + time +'\n';
    fs.open(filename, 'a', function (err, fd) {

        if (err) throw err;
        fs.appendFile(fd, str, 'utf8', function (err) {
            if (err) throw err;
            fs.close(fd, function (err) {
                if (err) throw err;
            })
        });
    });
}

function getData(fileName,userName,pdfName,startTime,endTime,names) {
        // const readline = require('readline');
        let content = '';
    let read = fs.readFileSync(fileName, 'utf-8');
    let reader = read.split('\n');
    reader.forEach(data => {
        multiData = data.split(' ');
        if (userName === 'teacher') {
            if (names) {
                splitname = names.split(',');
                splitname.forEach(user => {
                    if (multiData[0] === user && multiData[4] === pdfName) {
                        let writeTime = parseInt(Date.parse(multiData[6] +' '+ multiData[7]))
                        if (startTime < writeTime && writeTime < endTime) {
                            content += data + '\n'
                        }
                    }
                })
            } else {
                if (multiData[4] === pdfName) {
                    let writeTime = parseInt(Date.parse(multiData[6] +' '+ multiData[7]))
                    if (startTime < writeTime && writeTime < endTime) {
                        content += data + '\n'
                    }
                }
            }
        } else {
            if (multiData[0] === userName && multiData[4] === pdfName) {
                let writeTime = parseInt(Date.parse(multiData[6] +' '+ multiData[7]))
                if (startTime < writeTime && writeTime < endTime) {
                    content += data + '\n'
                }
            }
        }
        // console.log(data);
    });
    read = fs.readFileSync('removedata.txt', 'utf-8');
    reader = read.split('\n');
    reader.forEach(data => {
        //https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
        multiData = data.split(' ');
        if (userName === 'teacher') {
            if (names) {
                splitname = names.split(',');
                splitname.forEach(user => {
                    if (multiData[0] === user && multiData[4] === pdfName) {
                        let writeTime = parseInt(Date.parse(multiData[6] +' '+ multiData[7]))
                        if (startTime < writeTime && writeTime < endTime) {
                            content += data + '\n'
                        }
                    }
                })
            } else {
                if (multiData[4] === pdfName) {
                    let writeTime = parseInt(Date.parse(multiData[6] +' '+ multiData[7]))
                    if (startTime < writeTime && writeTime < endTime) {
                        content += data + '\n'
                    }
                }
            }
        } else {

            if (multiData[0] === userName && multiData[4] === pdfName) {
                let writeTime = parseInt(Date.parse(multiData[6] +' '+ multiData[7]))
                if (startTime < writeTime && writeTime < endTime) {
                    content += data + '\n'
                }
            }
        }
        // if (multiData[0] === userName && multiData[4] === pdfName) {
            
        //     let writeTime = parseInt(Date.parse(multiData[6] +' '+ multiData[7]))
        //     if (startTime < writeTime && writeTime < endTime) {
        //         content += data + '\n'
        //     }
        // }
        // console.log(data);
    });

    return content;

    //ストリームの読み込みは残しておく
    //完全非同期につきfilesyncでメモリ不足にならない限りは使用しない
        // let stream = fs.createReadStream(fileName, 'utf-8');
        // let reader = readline.createInterface({ input: stream });
        // reader.on('line', (data) => {
        //     let split = data.split(' ');
        //     // console.log(data);
        //     content += data + '\n';
        //     // console.log(content);
        // })
        // reader.on('close', function (data) {
        //     console.log(content);
        //     return content;
        // })
        // console.log(content);
        // return content;
}

exports.fileWrite = fileWrite;
exports.getData = getData;
exports.pageTransInfo = pageTransInfo;