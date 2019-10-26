function pdfLoad(url) {
    var pdfjsLib = require('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
    CMAP_URL = '/node_modules/pdfjs-dist/cmaps/';
    CMAP_PACKED = true;

    var pdf = null;
    var loadingTask = pdfjsLib.getDocument({
        url: url,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED
    });
    return loadingTask.promise.then(function (pdf_) {
        console.log(pdf_);
        pdf = pdf_;
        console.log(pdf);
        return pdf;
        // pageRender(pdf, pageNum);
    });
}

function pageRender(pdf,pageNum) {
    // console.log(PDFJS.cMapUrl);
    pdf.getPage(pageNum).then(function (page) {
        var scale = 1;
        var viewport = page.getViewport({ scale: scale });
        var pdfCan = document.getElementById('pdfCan');
        var context = pdfCan.getContext('2d');
        // Canvas.setHeight(viewport.height)
        // Canvas.setWidth(viewport.setWidth);
        pdfCan.height = viewport.height;
        pdfCan.width = viewport.width;

        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
}
// console.log(loadingTask);
exports.pdfLoad = pdfLoad; 
exports.pageRender = pageRender;