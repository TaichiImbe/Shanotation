// var annotasions = ['enclosure','line'];
//水色,青,緑,黄色,橙色,赤
//カラー参考サイト http://www.netyasun.com/home/color.html
var colorVariation = ['#8EF1FF', '#5D99FF', '#9BF9CC', '#FFFF66', '#FF6928', '#FF3333']
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
function dataset(ip, path, oCoords, pageNum, ident, text) {
    var array = new Array();
    var page = new Map();
    if (Pages.has(pageNum)) {
        page = Pages.get(pageNum);
    }
    if (page.has(ip)) {
        array = page.get(ip);
    }
    array.push(new datalist(ip, path, oCoords, ident, text));
    page.set(ip, array);
    Pages.set(pageNum, page);
    // console.log(Pages);
    //todo とりあえず割合の正規化
    // console.log(Datas);
}

/**
 *
 *
 * @param {*} page
 * @returns pathと色情報の集合
 */
function analys(page) {
    //todo 同じ座標に書いた人を求める
    var map = new Map();
    if (Pages.has(page)) {

        var data = Pages.get(page);
        var iplist = data.keys();
        data.forEach(element => {
            element.forEach(value => {
                var array = []
                if (value.text != null) {

                    if (map.has(value.text.str)) {
                        array = map.get(value.text.str);
                    }
                    array.push(value);
                    map.set(value.text.str, array);
                }
            });
        });
        // console.log(map);
        //todo ipごとに合計
        // map.forEach(element => {
        var count = new Map();
        map.forEach(function (value, key) {
            // console.log(key + ' ' + value);
            var i = 0;
            //文字列ごとの配列が取れる
            //element は datalist型 
            let iplist = new Array();
            let ipcheck = function (element) {
                for (let i = 0; i < iplist.length; i++){
                    if (iplist[i] === element.ip) {

                        return true;
                    }
                }
                return false;
            }
            map.get(key).forEach(element => {
                if (ipcheck(element)) {
                    return;
                } else {
                    iplist.push(element.ip);
                }
                console.log(iplist);
                if (count.has(key)) {
                    i = count.get(key);
                }
                count.set(key, i + 1);
            });
        });
        // console.log(count);
        // }) 

        //合計から色を決定
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
class datalist {
    constructor(ip, path, oCoords, ident, text) {
        this.ip = ip;
        this.path = path;
        this.oCoords = oCoords;
        this.text = text;
        this.ident = ident;
    }
}


exports.dataset = dataset;
exports.analys = analys;