var fabric = require('fabric').fabric;
var profile = require('./profile');
var Canvas = new fabric.Canvas('draw-area',{
    isDrawingMode: true,
    selection: true,
    stateful: true
});
// console.log(Canvas);
var Pen;
var AnnoCollection = new Map();
function setCanvasSize(viewport) {
        Canvas.setWidth(viewport.width);
        Canvas.setHeight(viewport.height);
}
window.addEventListener('load',() =>{
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

Canvas.on('object:added',function(e){
    let time = new Date();
    let y = time.getFullYear();
    let m = ("00"+ (time.getMonth()+1)).slice(-2);
    let d = ("00"+ time.getDate()).slice(-2);
    let hh = time.getHours();
    let mm = time.getMinutes();
    let ss = time.getSeconds();
    // logPrint(time);
    let realTime = y+"/"+m+"/"+d+" "+hh+":"+mm+":"+ss
    // logPrint(y+"/"+m+"/"+d+" "+hh+":"+mm+":"+ss);
    // logPrint(e);
    AnnoCollection.set(realTime,e.target);
    send(e.target);
});

global.Canvas = Canvas;
global.setCanvasSize = setCanvasSize;
global.Pen = Pen;