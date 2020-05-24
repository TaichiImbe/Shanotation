let pdfjsLib = require('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
CMAP_URL = '/node_modules/pdfjs-dist/cmaps/'
CMAP_PACKED = true;

// var url = '/pdf/imageprossesing6.pdf';
let url = '/pdf/'+getPdfName();

let pageNum = 1;
let pdf = null;
let _width = null
// function pageload() {

let pdfTextList = new Map();

window.addEventListener('load', function () {
    var loadingTask = pdfjsLib.getDocument({
        url: url,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED
    });
    loadingTask.promise.then(function (pdf_) {
        pdf = pdf_;
        pdf.getPage(pageNum).then((page) => {
            _width = page.getViewport({ scale: 1 }).width;
        })
        pageRender(pageNum);
        operator.textFilter(pdf.numPages);
        $f('pageMove').textContent = '1';
        $f('pageDef').textContent = '/'+pdf.numPages;
    });

})
// }

function pageRender(pageNum) {
    // console.log(PDFJS.cMapUrl);
    return new Promise(function () {

        pdf.getPage(pageNum).then((page) => _pageRender(page));
    })
}

// console.log(loadingTask);
function getPdfPage() {
    return pdf.numPages;
}

function loadTextSet(pdf) {
    return pdf.getPgae(pageNum).then((page) => {
        let scale = 1;
        page.getTextContent().then((textContent) => {
            let viewport = page.getViewport({ scale: scale });
            textContent.items.forEach(text => {
                text.transform = pdfjsLib.Util.transform(viewport.transform, text.transform);
                // console.log(text);
                // console.log(text);
            });
            pdfTextList.set(pageNum, text);
        })

    })
}

function getPdfText(pageNum) {
    if (pdfTextList.has(pageNum)) {
        return new Promise((resolve,reject) => {
            resolve(pdfTextList.get(pageNum));
        });
    }
    return pdf.getPage(pageNum).then(function (page) {
        let scale = 1;
        // if (page._pageInfo.view[2] * scale < 720) {
        //     scale = 2;
        // } 
        // page.getAnnotations().then((data) => {
        //     // console.log(data);
        // })
        // page.getOperatorList().then((data) => {
        //     // console.log(data);
        // })
        return page.getTextContent().then(function (textContent) {
            // console.log(textContent);
            let viewport = page.getViewport({ scale: scale });
            textContent.items.forEach(text => {
                text.transform = pdfjsLib.Util.transform(viewport.transform, text.transform);
                // console.log(text);
                // console.log(text);
            });
            pdfTextList.set(pageNum, textContent);
            return textContent;
        });
    });
}
function getPdfOperator(pageNum) {
    return pdf.getPage(pageNum).then((page) => {
        let scale = 1;
        // if (page._pageInfo.view[2] * scale < 720) {
        //     scale = 2;
        // }
        return page.getOperatorList().then((operationList) => {
            for (operation of operationList.argsArray) {
                if (operation) {
                    if (operation.length === 3) {
                        r = operation[0]
                        g = operation[1]
                        b = operation[2]
                        // console.log(operation);
                    }
                }
            } 
            return operationList;
        })
    })
}

function _pageRender(page) {
    var scale = 1.0;
            //todo scaleは大きさを変更すると座標がバグるので注意
            // テキストの方がおかしいのかな...?
            // viewport いじってる... あれ?
            // 変換時 viewportが設定しているよね
            // if (page._pageInfo.view[2] * scale < 720) {
            //     scale = 2;
            // } 
            // let canvasWrapper = document.getElementById('canvas-wrapper');
            var viewport = page.getViewport({ scale: scale });
            var pdfCan = document.getElementById('pdfCan');
            var context = pdfCan.getContext('2d');
            // scale = canvasWrapper.scrollWidth / viewport.width;
            // viewport = page.getViewport({scale: scale});
        setCanvasSize(viewport);
        // Canvas.setHeight(viewport.height)
        // Canvas.setWidth(viewport.setWidth);
        pdfCan.height = viewport.height;
        pdfCan.width = viewport.width;

        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        let renderTask = page.render(renderContext);
        page.getTextContent().then(function (textContent) {
            // console.log(textContent);
            textContent.items.forEach(text => {
                var tx = pdfjsLib.Util.transform(viewport.transform, text.transform);
                // console.log(text);
                // console.log(tx);   
            });
        });
}

function TransForm(transform) {
    return pdf.getPage(pageNum).then(page => {
        let scale = 1;
        // if (page._pageInfo.view[2] * scale < 720) {
        //     scale = 2;
        // } 
        let viewport = page.getViewport({ scale: scale });
        return pdfjsLib.Util.transform(viewport.transform, transform);
    })
}

window.addEventListener('resize', (e) => {
    // let canvasWrapper = document.getElementById('canvas-wrapper');
    // pageRender(global.pageNum);
})

global.pageRender = pageRender;
global.pageNum = pageNum;
global.getPdfPage = getPdfPage;
global.getPdfText = getPdfText;
global.getPdfOperator = getPdfOperator;
global.TransForm = TransForm;