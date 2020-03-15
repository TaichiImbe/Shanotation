const fabric = require('fabric').fabric;
const profile = require('./profile');


function log(id, path) {
    const canvas = new fabric.Canvas(id , {
        selection: true
    });

    let stroke = new fabric.Path(path, {
        fill:'rgba(0,0,0,0)',
        stroke:'rgba(0,0,0,0)',
        strokeWidth: 5
    })
    canvas.add(stroke);

}