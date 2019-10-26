
exports.Annotation = class Annotation {
    constructor() {
        var fabric = require('fabric').fabric;
        this.Canvas = new fabric.Canvas('draw-area', {
            isDrawingMode: true,
            selection: true,
            stateful: true
        });
    }

    init() {
        var pdfCan = document.getElementById('pdfCan');
        // console.log(this.Canvas);
        this.Canvas.setWidth(pdfCan.width);
        this.Canvas.setHeight(pdfCan.height);

        fabric.Object.prototype.transparentCorners = false;
        this.Canvas.freeDrawingBrush = new fabric.PencilBrush(this.Canvas);
        this.Canvas.freeDrawingBrush.color = 'rgb(0,0,0)';
        this.Canvas.freeDrawingBrush.width = 5;
        this.Canvas.freeDrawingBrush.shadowBlur = 0;
        this.Canvas.hoverCursor = 'move';
    }
}