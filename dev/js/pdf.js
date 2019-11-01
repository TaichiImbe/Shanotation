var pdfjsLib = require('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
CMAP_URL = '/node_modules/pdfjs-dist/cmaps/'
CMAP_PACKED = true;

var url = '/pdf/imageprossesing6.pdf';

var pageNum = 1;
var pdf = null;
// function pageload() {
window.addEventListener('load', function () {
    var loadingTask = pdfjsLib.getDocument({
        url: url,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED
    });
    loadingTask.promise.then(function (pdf_) {
        pdf = pdf_;
        pageRender(pageNum);
        $f('pageMove').textContent = '1';
        $f('pageDef').textContent = pdf.numPages;
    });

})
// }

function pageRender(pageNum) {
    // console.log(PDFJS.cMapUrl);
    pdf.getPage(pageNum).then(function (page) {
        var scale = 1;
        var viewport = page.getViewport({ scale: scale });
        var pdfCan = document.getElementById('pdfCan');
        var context = pdfCan.getContext('2d');
        setCanvasSize(viewport);
        // Canvas.setHeight(viewport.height)
        // Canvas.setWidth(viewport.setWidth);
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
    });
}
// console.log(loadingTask);
function getPdfPage() {
    return pdf.numPages;
}

function getPdfText(pageNum) {
    return pdf.getPage(pageNum).then(function (page) {
        scale = 1;
        var viewport = page.getViewport({ scale: scale });
        return page.getTextContent().then(function (textContent) {
            // console.log(textContent);
            textContent.items.forEach(text => {
                text.transform = pdfjsLib.Util.transform(viewport.transform, text.transform);
                // console.log(text);
                // console.log(text);
            });
            return textContent;
        });
    });
}

global.pageRender = pageRender;
global.pageNum = pageNum;
global.getPdfPage = getPdfPage;
global.getPdfText = getPdfText;