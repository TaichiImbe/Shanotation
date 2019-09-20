// var pdfLoad = require('./_canvasUtil').pdfLoad;
var util = require('./_canvasUtil');
// var pageRender = require('./_canvasUtil').pageRender;
var Penclie = require('./_profile').Penclie;
var Annotation = require('./_Annotation').Annotation;

var url = '/pdf/middle2019.pdf';
var pageNum = 1;
var pdf = null;

var ano = new Annotation();

// Annotation = new Annotation();

util.pdfLoad(url).then(function(pdf_){
    pdf = pdf_;
    util.pageRender(pdf, pageNum);
    ano.init();
});

