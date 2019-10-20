// var annotasions = ['enclosure','line'];
var identifier = ['enclosure', 'line'];
var Pages = new Map();

/**
 *送信されてきた分析データをセット
 *
 * @param {*} ip 
 * @param {*} data
 * @param {*} oCoords
 */
function dataset(ip,path,oCoords,pageNum,ident,text) {
    var array = new Array();
    var page = new Map();
    if (Pages.has(pageNum)) {
        page = Pages.get(pageNum);
    }
    if (page.has(ip)) {
        array = page.get(ip);
    }
    array.push(new datalist(path,oCoords,ident));
    page.set(ip, array);
    Pages.set(pageNum, page);
    // console.log(Pages);
    //todo とりあえず割合の正規化
    // console.log(Datas);
}

function analys(page) {
    //todo 同じ座標に書いた人を求める
    if (Pages.has(page)) {

        var keys = Pages.get(page);
    }

    return null;

}

/**
 *  分析データクラス
 *  パスのまとまり、バウンディングボックス,識別子
 * @class datalist
 */
class datalist{
    constructor(path,oCoords,ident){
        this.path = path;
        this.oCoords = oCoords;
        this.ident = ident;
    }
}


exports.dataset = dataset;
exports.analys = analys;