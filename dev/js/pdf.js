let pdfjsLib = require('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
CMAP_URL = '/node_modules/pdfjs-dist/cmaps/'
CMAP_PACKED = true;

// var url = '/pdf/imageprossesing6.pdf';
let url = '/pdf/'+getPdfName();

let pageNum = 1;
let pdf = null;
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
        $f('pageDef').textContent = '/'+pdf.numPages;
    });

})
// }

function pageRender(pageNum) {
    // console.log(PDFJS.cMapUrl);
    return new Promise(function () {

    pdf.getPage(pageNum).then(function (page) {
        var scale = 1;
        //todo scaleは大きさを変更すると座標がバグるので注意
        // テキストの方がおかしいのかな...?
        // viewport いじってる... あれ?
        // 変換時 viewportが設定しているよね
        if (page._pageInfo.view[2] * scale < 720) {
            scale = 2;
        } 
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
    })
}
// console.log(loadingTask);
function getPdfPage() {
    return pdf.numPages;
}

function getPdfText(pageNum) {
    return pdf.getPage(pageNum).then(function (page) {
        let scale = 1;
        if (page._pageInfo.view[2] * scale < 720) {
            scale = 2;
        } 
        return page.getTextContent().then(function (textContent) {
            // console.log(textContent);
            let viewport = page.getViewport({ scale: scale });
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