const socketIO = require('socket.io');

const fileio = require('./fileio');
const mongodb = require('./mongodb');
const analys = require('./analys');

let _io;
module.exports = {
    Listen: (server) => {
        _io = socketIO.listen(server);
        _io.sockets.on('connection', (socket) => {
            socket.on('object', (name, data, color, oCoords, pageNum, ident, text, pdfName, time) => {
                if (data.type === 'path') {
                    const parser = new URL(socket.handshake.headers.referer);
                    if (parser.pathname.includes('/index')) {
                        fileio.fileWrite('analysdata.text', name, data, color, pageNum, pdfName, 'insert', time);
                        mongodb.Insert('analys', [
                            { userName: name, data: data, color: color, pageNum: pageNum, pdfName: pdfName, ident: 'insert', time: time }
                        ]);
                    } else if (parser.pathname.includes('/replay')) {
                        mongodb.Insert('replay', [
                            { userName: name, data: data, color: color, pageNum: pageNum, pdfName: pdfName, ident: 'insert', time: time }
                        ]);
                    }
                    analys.dataset(name, data, oCoords, pageNum, ident, text);
                }
            })
            socket.on('annotation', (name, data, color, pageNum, pdfName, time) => {
                const parser = new URL(socket.handshake.headers.referer);
                if (parser.pathname.includes('/index')) {
                    fileio.fileWrite('analysdata.txt', name, data, color, pageNum, pdfName, 'insert', time);
                } else if (parser.pathname.includes('/replay')) {
                    fileio.fileWrite('replay.txt', name, data, color, pageNum, pdfName, 'insert', time);
                }
            });
            socket.on('remove', (name, data, color, oCoords, pageNum, text, indet, pdfName, time) => {
                const parser = new URL(socket.handshake.headers.referer);
                if (parser.pathname.includes('/index')) {
                    fileio.fileWrite('removedata.txt', name, obj, color, pageNum, pdfName, 'delete', time);
                } else if (parser.pathname.includes('replay')) {
                    fileio.fileWrite('replay.txt', name, obj, color, pageNum, pdfName, 'delete', time);
                }
                analys.dataRemove(name, obj, oCoords, pageNum, text);
                let ptext = analys.analys(pageNum, userList.size);
                if (name !== 'teacher') {
                    if (parser.pathname.includes('/index')) {
                        io.sockets.emit('teacher', ptext, pageNum);
                    } else if (parser.pathname.includes('/replay')) {
                        io.sockets.emit('replayteacher', ptext, pageNum);
                    }
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
                mongodb.Insert('pagetrans', [{ 'userName': userName, 'ident': ident, 'ppage': parseInt(pageNum.split(' ')[0],10), 'npage': parseInt(pageNum.split(' ')[1],10), 'pdfName': pdfName,'day':time.split(' ')[0],'time':time.split(' ')[1]}]);
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
                analys.setTeacherSelection(true);
                analys.textset(text,pageNum);
            })
        });
    }
}