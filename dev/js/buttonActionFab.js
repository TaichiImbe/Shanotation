let $ = require('jquery');
let eraserMode = false;

const Operator = require('./_operator');
const operator = new Operator();

const ReplayOperator = require('./_replayOperator');
const replayOperator = new ReplayOperator();

let $f = function (id) {
    return document.getElementById(id);
}

let selectButton = $f('select'),
    clearEI = $f('clear-button'),
    eraserButton = $f('eraser'),
    drawButton = $f('draw'),
    // drawingColorEl = $('drawing-color');
    colorButton = $f('colorButton'),
    drawingLine = $f('Penwidth'),
    prevButton = $f('prev'),
    nextButton = $f('next'),
    pageMoveArea = $f('pageMove');

pageMoveArea.addEventListener('keydown', event => {
    // console.log(event);
    if (event.key.search('[0-9]')) {
        return;
    }
});

let keys = null;
document.addEventListener('keydown',(event)=> {
    let keyname = event.key;
    if (keyname === 'Meta') {
        keys=keyname;
    } else if (keyname.indexOf('[a-z]')) {
        if (keys === 'Meta') {
            if (keyname === 'c') {
                getPdfText(pageNum).then((text) => {
                    //https://qiita.com/simiraaaa/items/2e7478d72f365aa48356
                    let tmp = document.createElement('div');
                    let pre = document.createElement('pre');
                    pre.style.webkitUserSelect = 'auto';
                    pre.style.userSelect = 'auto';
                    tmp.appendChild(pre).textContent = JSON.stringify(text);
                    document.body.appendChild(tmp);
                    document.getSelection().selectAllChildren(tmp);
                    document.execCommand('copy');
                    document.body.removeChild(tmp);
                })
            }
        }
    }
})


prevButton.onclick = function () {
    if (pageNum <= 1) {
        return;
    }
    let pageT = pageNum + ' ';
    operator.setPageAnnotation(Canvas.getObjects(),pageNum);
    // Canvas.clear()
    // logPrint(PageAnno);
    pageNum--;
    pageT += pageNum;
    sendTrans('prev', pageT);
    operator.setCanvasAnnotation(pageNum)
    pageRender(pageNum).then(function () {
    });
    // pageMoveArea.value = pageNum;
    pageMoveArea.textContent = pageNum;
}

nextButton.onclick = function () {
    if (pageNum >= getPdfPage()) {
        return;
    }
    let pageT = pageNum + ' ';
    operator.setPageAnnotation(Canvas.getObjects(),pageNum);
    // Canvas.clear()
    // logPrint(PageAnno);
    pageNum++;
    pageT += pageNum;
    sendTrans('next', pageT);
    operator.setCanvasAnnotation(pageNum)
    pageRender(pageNum).then(function () {
    });
    pageMoveArea.textContent = pageNum;
    // eraserButton.onclick();
}

//canvas上の絵を全部消す
clearEI.onclick = function () {
    Canvas.clear()
    clearObject(pageNum);
};

//選択モード
selectButton.onclick = function () {
    if (getUserName() !== 'teacher') {
        Canvas.isDrawingMode = false;
    } else {
        Canvas.isDrawingMode = !Canvas.isDrawingMode;
    }
};

//消しゴムボタン
// todo ページ遷移後に線が消えない問題を調査
eraserButton.onclick = function () {
    global.eraserMode = true;
    Canvas.isDrawingMode = true;
    var context = Canvas.contextTop;
    // context = Canvas.getContext();
    // canvas.contextTop.globalCompositeOperation = 'destination-out';
    // canvas.contextTop.globalCompositeOperation = 'xor';
    // context.globalCompositeOperation = 'source-out';
    context.globalCompositeOperation = 'destination-out';
};

//ペンボタン
drawButton.onclick = function () {
    global.eraserMode = false;
    Canvas.isDrawingMode = true;
    Canvas.contextTop.globalCompositeOperation = 'source-over';
    // 線の状態を定義する
    // MDN CanvasRenderingContext2D: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
    // context.lineCap = 'round' //丸みを帯びた線にする
    // context.lineJoin = 'round' //丸みを帯びた線にする
    // context.lineWidth = 2; //線の太さ
    // context.strokeStyle = "rgb(0,0,0)";
};

//カラーパレット
jQuery(function ($) {
    if ($f('picker').style.display != 'none') {

        $("#picker").spectrum({
            allowEmpty: true,
            color: "#000",
            showInput: true,
            containerClassName: "full-spectrum",
            showInitial: true,
            showPalette: true,
            showSelectionPalette: true,
            showApha: true,
            maxPaletteSize: 10,
            preferredFormat: "hex",

            move: function (color) {

            },

            show: function () {

            },

            beforeShow: function () {

            },

            hide: function (color) {
                Canvas.freeDrawingBrush.color = new fabric.Color(color.toHexString()).toRgb();
                // Pen.color = Canvas.freeDrawingBrush.color;
            },

            palette: [
                ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                    "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
                ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                    "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                    "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                    "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                    "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                    "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                    "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                    "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                    "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                    "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                    "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
            ]

        });
    }
});

drawingLine.onchange = function () {
    Canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    // Pen.brushWidth = Canvas.freeDrawingBrush.width;
}

global.eraserMode = eraserMode;
global.$f = $f;

global.operator = operator;
global.replayOperator = replayOperator;