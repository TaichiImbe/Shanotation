let fabric = require('fabric').fabric;
global.Canvas = new fabric.Canvas('draw-area',{
    isDrawingMode: true,
    selection: true,
    stateful: true
});

pageNum = 1;
global.pageNum = this.pageNum; 
