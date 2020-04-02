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
            area.add(stroke);
            const num = document.getElementById('pageNum' + element.name);
            const pdfName = document.getElementById('pdfName' + element.name);
            _pdf(parseInt(num.innerHTML), pdfName.innerHTML, 'pdf' + element.name)
        };
    }
    for (let button of buttons) {
        button.click();
    }

})

const pdfjsLib = require('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
CMAP_URL = '/node_modules/pdfjs-dist/cmaps/'
CMAP_PACKED = true;


function _pdf(pageNum, pdfName, canvasName) {
    const url = '/pdf/' + pdfName;
    const loadingTask = pdfjsLib.getDocument({
        url: url,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED
    });
    loadingTask.promise.then(function (pdf_) {
        pdf = pdf_;
        pdf.getPage(pageNum).then((page) => {
            _width = page.getViewport({ scale: 1 }).width;
            _pageRender(page, canvasName);
        })
    });
}

function _pageRender(page, canvasName) {
    var scale = 1.0;
    var viewport = page.getViewport({ scale: scale });
    var pdfCan = document.getElementById(canvasName);
    var context = pdfCan.getContext('2d');
    pdfCan.height = viewport.height;
    pdfCan.width = viewport.width;

    var renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    page.render(renderContext);
    page.getTextContent().then(function (textContent) {
        // console.log(textContent);
        textContent.items.forEach(text => {
            var tx = pdfjsLib.Util.transform(viewport.transform, text.transform);
            // console.log(text);
            // console.log(tx);   
        });
    });
}
