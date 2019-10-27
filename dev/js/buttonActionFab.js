var PageAnno = new Map();
var $ = require('jquery');
var eraserMode = false;
var pageTrans = false;

window.addEventListener('load', () => {
    var $f = function (id) {
        return document.getElementById(id);
    }

    // const canvas = new fabric.Canvas('draw-area');

    var selectButton = $f('select'),
        clearEI = $f('clear-button'),
        eraserButton = $f('eraser'),
        drawButton = $f('draw'),
        // drawingColorEl = $('drawing-color');
        colorButton = $f('colorButton'),
        drawingLine = $f('Penwidth'),
        prevButton = $f('prev'),
        nextButton = $f('next'),
        textArea = $f('text');

    prevButton.onclick = function () {
        if (pageNum <= 1) {
            return;
        }
        PageAnno.set(pageNum, Canvas.getObjects());
        // Canvas.clear()
        // logPrint(PageAnno);
        pageNum--;
        AnnotationSet(pageNum).then(function () {
        });
        pageRender(pageNum);
        // textArea.textContent = pageNum + "/" + pdf.numPages;
    }

    nextButton.onclick = function () {
        if (pageNum >= getPdfPage()) {
            return;
        }
        PageAnno.set(pageNum, Canvas.getObjects());
        // Canvas.clear()
        // logPrint(PageAnno);
        pageNum++;
        AnnotationSet(pageNum).then(function () {
        });
        pageRender(pageNum);
        // textArea.textContent = pageNum + "/" + pdf.numPages;
    }



    //canvas上の絵を全部消す
    clearEI.onclick = function () {
        Canvas.clear()
    };

    //選択モード
    selectButton.onclick = function () {
        Canvas.isDrawingMode = false;
    };

    //消しゴムボタン
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

    //ペンの変更を表示・非表示
    $(function () {
        $('#Penwidth').toggle();
        $('#penSize').click(function () {
            $('#Penwidth').toggle();
        });
    });

    drawingLine.onchange = function () {
        Canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        // Pen.brushWidth = Canvas.freeDrawingBrush.width;
    }
})

//todo 毎回PageAnooに追加するArrayをリセット
//      or 配列の中身をみる
function setPage(data, page) {
    console.log(data);
    var collection = new Array();
    if (Array.isArray(data)) {
        data.forEach(text => {
            collection.push(text);
        });
    } else {

        if (PageAnno.has(page)) {
            collection = PageAnno.get(page);
            collection.push(data);
        } else {
            collection.push(data);
        }
    }
    // Canvas.add(data);
    PageAnno.set(page, collection);
    // console.log(PageAnno);
    AnnotationSet(pageNum).then(function () {

    });
}

function AnnotationSet(pageNum) {
    global.pageTrans = true;
    return new Promise(function () {

        Canvas.clear();
        const Anno = PageAnno.get(pageNum);
        if (Anno != null) {
            Anno.forEach(element => {
                Canvas.add(element);
            });
        }
        global.pageTrans = false;
    })
}
global.setPage = setPage;
global.eraserMode = eraserMode;
global.pageTrans = pageTrans
