// var annotasions = ['enclosure','line'];
var identifier = ['enclosure', 'line'];

/**
 * Pages は ページごとにipとpathのmapを管理する
 */
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
    array.push(new datalist(path,oCoords,ident,text));
    page.set(ip, array);
    Pages.set(pageNum, page);
    // console.log(Pages);
    //todo とりあえず割合の正規化
    // console.log(Datas);
}

function analys(page) {
    //todo 同じ座標に書いた人を求める
    var map = new Map();
    var array = []
    if (Pages.has(page)) {

        var data = Pages.get(page);
        var iplist = data.keys();
        data.forEach(element => {
            element.forEach(value => {
                console.log(value.text.str);
                i = 0;
                if (map.has(value.text.str)) {
                    i = map.get(value.text.str);
                }
                map.set(value.text.str, i + 1);
                // console.log(map.get(value.text.str));
            });
            // console.log(element);
        });
        // while (true) {

        //     iteratorResult = iplist.next();
        //     if (iteratorResult.done) break;
        //     // console.log(iteratorResult);
        //     var dataset = iplist.get(iteratorResult.value);
        //     console.log(dataset);
        // }
        

    }

    return null;

}

/**
 *  分析データクラス
 *  パスのまとまり、バウンディングボックス,識別子,一緒に存在するテキスト
 * @class datalist
 */
class datalist{
    constructor(path,oCoords,ident,text){
        this.path = path;
        this.oCoords = oCoords;
        this.text = text;
        this.ident = ident;
    }
}


exports.dataset = dataset;
exports.analys = analys;