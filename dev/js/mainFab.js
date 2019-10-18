var fabric = require('fabric').fabric;
var profile = require('./profile');
var Canvas = new fabric.Canvas('draw-area', {
    isDrawingMode: true,
    selection: false,
    stateful: true
});
// console.log(Canvas);
var Pen;
var identifier = ['enclosure', 'line'];
var AnnoCollection = new Map();
function setCanvasSize(viewport) {
    Canvas.setWidth(viewport.width);
    Canvas.setHeight(viewport.height);
}
window.addEventListener('load', () => {
    // function init(viewport) {
    // const pd = Canvas.getElementById('pdfCan');
    // console.log('Event');


    fabric.Object.prototype.transparentCorners = false;
    Canvas.freeDrawingBrush = new fabric.PencilBrush(Canvas);
    Canvas.freeDrawingBrush.color = 'rgb(0,0,0)';
    Canvas.freeDrawingBrush.width = 5;
    Canvas.freeDrawingBrush.shadowBlur = 0;
    Canvas.hoverCursor = 'move';
    console.log("Fabric" + Canvas);
    Pen = new profile.Pencile(Canvas.freeDrawingBrush.color, Canvas.freeDrawingBrush.width, Canvas.freeDrawingBrush.shadowBlur);
    // }
});

Canvas.on('object:selected', function (e) {
    console.log(e.target);
})

Canvas.on('object:added', function (e) {
    // console.log(e.target);
    let object = e.target;
    // Canvas.getObjects().forEach(element => {
    // console.log(element);
    // });
    let time = new Date();
    let y = time.getFullYear();
    let m = ("00" + (time.getMonth() + 1)).slice(-2);
    let d = ("00" + time.getDate()).slice(-2);
    let hh = ("00" + time.getHours()).slice(-2);
    let mm = ("00" + time.getMinutes()).slice(-2);
    let ss = ("00" + time.getSeconds()).slice(-2);
    // logPrint(time);
    let realTime = y + "/" + m + "/" + d + " " + hh + ":" + mm + ":" + ss
    // logPrint(y+"/"+m+"/"+d+" "+hh+":"+mm+":"+ss);
    // logPrint(e);
    if (eraserMode) {
        Canvas.remove(object);
        Canvas.getObjects().forEach(element => {
            element.path.forEach(path => {
                if (coverd(path, object)) {
                        Canvas.remove(element);
                }
                // object.path.forEach(data => {
                //     // console.log(corverd(path, data));
                //     if (coverd(path, data)) {
                //     }
                // });
            });
        });
    } else {
        ident = identification(object);

        AnnoCollection.set(realTime, e.target);
        send('object', e.target, e.target.oCoords, pageNum, ident,realTime);
    }
});

function identification(canvas) {
    oCoords = canvas.oCoords;
    tl = oCoords.tl;
    bl = oCoords.bl;
    tr = oCoords.tr;
    var double = function (l1, l2) {
            return Math.pow(l1.x - l2.x, 2) + Math.pow(l1.y-l2.y,2);
    }
    var d = function (x1, x2) {
        return Math.sqrt(double(x1, x2));
    }
    if (d(tl,bl) < 49){
        return identifier[1];
    } else if(d(tl,tr) < 49){
        return identifier[1];
    } else {
        return identifier[0];
    } 
}


function coverd(path, data) {
    r = Math.round;
    // console.log(data.oCoords);
    // console.log(path);
    let bl = data.oCoords.bl,
        br = data.oCoords.br,
        tl = data.oCoords.tl;
    for (i = 1; i < path.length; i += 2){
        // console.log(path[i]);
        if (bl.x < path[i] && br.x > path[i]){
            // console.log(path);
            if (bl.y > r(path[i + 1]) && tl.y < r(path[i + 1])) {
                return true;
            }
        }
    }
    return false;
    // for (i = 1; i < path.length; i += 2) {
    //     for (j = 1; j < path.length; j += 2) {

    //         if (r(path[i]) == r(data[j]) && r(path[i + 1]) == r(data[j + 1])) {
    //             return true;
    //         }
    //     }

    // }
    // return false;

}

/**
 * 教師側の表示用データを作る
 *
 * @param {*} data
 * @param {*} pageNum
 * @param {*} ident
 */
function make(data, oCoords,pageNum, ident) {
    var line
    if (ident == identifier[0]) {
        line = makeEnclosure(oCoords);
    } else if (ident == identifier[1]) {
        line = makeLine(data); 
    }
    if (line !== null) {
        setPage(line, pageNum);
    }
}

/**
 * 線を作る(仮)
 *
 * @param {*} data
 */
function makeLine(data) {
    var m, l;
    data.path.forEach(element => {
        if (element[0] == 'M') {
            m = element;
        } else if (element[0] == 'L') {
            l = element;
        } else {
            // console.log(element);
        }
    });
    var path = [m[1], m[2], l[1], l[2]];
    var line = new fabric.Line(path, {
        fill: 'red',
        stroke: 'red',
        strokeWidth: 5,
        selectable: false,
        evented: false,
    });
    // Canvas.add(line);
    return line;
}

/**
 * 円を作る
 *
 * @param {*} data
 */
function makeEnclosure(oCoords) {
    var height = oCoords.bl.y - oCoords.tl.y;
    var width = oCoords.tr.x - oCoords.tl.x;
    var Enclosure = new fabric.Rect({
        top: oCoords.tl.y,
        left : oCoords.tl.x,
        width : width,
        height : height,
        opacity: 0.5
    });
    console.log(Enclosure);

    return Enclosure ;
}

global.Canvas = Canvas;
global.setCanvasSize = setCanvasSize;
global.Pen = Pen;
global.make = make;