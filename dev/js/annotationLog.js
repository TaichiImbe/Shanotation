const fabric = require('fabric').fabric;
const profile = require('./profile');


window.addEventListener('load', () => {
    const buttons = document.getElementsByClassName('dispData');
    for (let button of buttons) {
    button.onclick = (e) => {
        const element = e.target;
        const area = new fabric.Canvas(element.name, {
            selection: true
        });
        const stroke = new fabric.Path(element.value, {
            fill: 'rgba(0,0,0,0)',
            stroke: 'rgb(0,0,0)',
            strokeWidth: 5
        })
        console.log(stroke);
        area.add(stroke);

    };
    
    }

})