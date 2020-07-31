const fabric = require('fabric').fabric;
const profile = require('./profile');

class Canvas {
    constructor() {
        canvas = new fabric.Canvas('draw-area', {
            isDrawingMode: true,
            selection: true,
            stateful: true
        });
    }
    setCanvasSize(viewport) {
        // Canvas.setWidth(viewport.width);
        // Canvas.setHeight(viewport.height);
        this.canvas.setWidth(viewport.width);
        this.canvas.setHeight(viewport.height);
        //ページを遷移する時にsetWidthをすると,contextが変更される
        //今まで動いていたのは謎
        if (global.eraserMode) {
            this.canvas.contextTop.globalCompositeOperation = 'destination-out';
        }
    }

}