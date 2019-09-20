// var util = require('./_canvasUtil');
// var pageRender = require('./_canvasUtil').pageRender;
// var Penclie = require('./_profile').Penclie;
// var Annotation = require('./_Annotation').Annotation;
var pdfjsLib = require('pdfjs-dist');
var fabric = require('fabric').fabric;

pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
CMAP_URL = '/node_modules/pdfjs-dist/cmaps/';
CMAP_PACKED = true


var url = '/pdf/middle2019.pdf';
var pageNum = 1;
var pdf = null;

let Pen;
var Canvas = new fabric.Canvas('draw-area', {
    isDrawingMode: true,
    selection: true,
    stateful: true
});

var AnnoCollection = new Map();
window.addEventListener('load', () => {

    // const pd = Canvas.getElementById('pdfCan');

    Canvas.setWidth(window.innerWidth);
    Canvas.setHeight(window.innerHeight);

    fabric.Object.prototype.transparentCorners = false;
    Canvas.freeDrawingBrush = new fabric.PencilBrush(Canvas);
    Canvas.freeDrawingBrush.color = 'rgb(0,0,0)';
    Canvas.freeDrawingBrush.width = 5;
    Canvas.freeDrawingBrush.shadowBlur = 0;
    Canvas.hoverCursor = 'move';

    // Pen = new Penclie(Canvas.freeDrawingBrush.color, Canvas.freeDrawingBrush.width, Canvas.freeDrawingBrush.shadowBlur);

    loadingTask.promise.then(function (pdf_) {
        console.log(pdf_);
        pdf = pdf_;
        console.log(pdf);
        pageRender(pageNum);
    });
    
});
Canvas.on('object:added', function (e) {
        let time = new Date();
        let y = time.getFullYear();
        let m = ("00" + (time.getMonth() + 1)).slice(-2);
        let d = ("00" + time.getDate()).slice(-2);
        let hh = time.getHours();
        let mm = time.getMinutes();
        let ss = time.getSeconds();
        // logPrint(time);
        let realTime = y + "/" + m + "/" + d + " " + hh + ":" + mm + ":" + ss
        // logPrint(y+"/"+m+"/"+d+" "+hh+":"+mm+":"+ss);
        // logPrint(e);
        AnnoCollection.set(realTime, e.target);
    console.log(AnnoCollection);
    });


var loadingTask = pdfjsLib.getDocument({
    url: url,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED
});

function pageRender(pageNum) {
    pdf.getPage(pageNum).then(function (page) {
        var scale = 1;
        var viewport = page.getViewport(scale);
        var pdfCan = document.getElementById('pdfCan');
        var context = pdfCan.getContext('2d');
        Canvas.setHeight(viewport.height);
        Canvas.setWidth(viewport.width);
        pdfCan.height = viewport.height;
        pdfCan.width = viewport.width;
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
}