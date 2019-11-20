// var pdfLoad = require('./_canvasUtil').pdfLoad;
let util = require('./_canvasUtil');
// var pageRender = require('./_canvasUtil').pageRender;
let Penclie = require('./_profile').Penclie;
let Annotation = require('./_Annotation').Annotation;

let url = '/pdf/middle2019.pdf';
let pageNum = 1;
let pdf = null;

let ano = new Annotation();

// Annotation = new Annotation();

util.pdfLoad(url).then(function(pdf_){
    pdf = pdf_;
    util.pageRender(pdf, pageNum);
    ano.init();
});

