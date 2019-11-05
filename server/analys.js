// var annotasions = ['enclosure','line'];
//水色,青,緑,黄色,橙色,赤
//カラー参考サイト http://www.netyasun.com/home/color.html
var colorVariation = ['#8EF1FF', '#5D99FF', '#9BF9CC', '#FFFF66', '#FF6928', '#FF3333']
var identifier = ['enclosure', 'line'];

/**
 * Pages は ページごとにipとpathのmapを管理する
 * 2019/11/04 変更 ページごとにユーザ名とpathのmapを管理
 */
var Pages = new Map();
var textList = new Set();

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
    console.log(text);
    array.push(new datalist(ip, path, oCoords, ident, text));
    page.set(ip, array);
    Pages.set(pageNum, page);
    // console.log(Datas);
    let inCheck = function (text) {
        // console.log(textList);
        let it = textList.values();
        while (true) {
            let textconsider = it.next();
            // console.log(textconsider.value);
            if (!textconsider.done) {
                let value = textconsider.value;
                if (value.str === text.str) {
                    if (value.transform[4] === text.transform[4] && value.transform[5] === text.transform[5]) {
                        return false;
                    }
                }
            } else {
                break;
            }

        }
        return true;
    }
    // console.log(inCheck(text));
    if (inCheck(text)) {
        textList.add(text);
    }
    // console.log(textList);
}

/**
 *
 *
 * @param {*} page
 * @returns pathと色情報の集合
 */
function analys(page,userListSize) {
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
                for (let i = 0; i < iplist.length; i++) {
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
                // console.log(iplist);
                if (count.has(key)) {
                    i = count.get(key);
                }
                count.set(key, i + 1);
            });
        });
        // console.log(count);
        // }) 

        //todo 合計から色を決定
        //todo とりあえず割合の正規 ?
        let list = [];
        count.forEach(function(value,keys) {
            let val = count.get(keys);
            //書き込みごとに比率を求める
            let parth = val / userListSize;
            // 比率から色を決める(とりあえず決め打ち)
            let color = parth *(colorVariation.length - 1- 0) + 0;
            // console.log(color);
            let it = textList.values();
            while (true) {
                let textconsider = it.next();
                // console.log(textconsider.value);
                if (!textconsider.done) {
                    let value = textconsider.value;
                    if (value.str === keys) {
                        textconsider.value.color = colorVariation[Math.round(color)];
                        list.push(textconsider.value);  
                    }
                } else {
                    break;
                }
            }
            // console.log(textList);
        })
        return list;

    }
    return null;
}

function analysOne(page,text,userListSize){

    // var map = new Map();
    let array = [];
    if (Pages.has(page)) {
        let str ='';
        var data = Pages.get(page);
        var iplist = data.keys();
        data.forEach(element => {
            element.forEach(value => {
                // var array = []
                if (value.text.str == text.str) {

                    // if (map.has(value.text.str)) {
                    //     array = map.get(value.text.str);
                    // }
                    array.push(value);
                    str = value;
                    // map.set(value.text.str, array);
                }
            });
        });
        var iplist = [];
            var p = 0;
        array.forEach(element => {
            
            // console.log(element);
            // console.log(iplist);
            let check = function(element){
                for (i = 0; i < iplist.length; i++){
                    if(iplist[i] === element.ip){
                        return false;
                    }
                }
                return true;
            }
            if(check(element)){
                iplist.push(element.ip);
                p++;
            }
        });
        // console.log(p);
            //書き込みごとに比率を求める
            let parth = p / userListSize;
            // 比率から色を決める(とりあえず決め打ち)
            let color = parth *(colorVariation.length - 1- 0) + 0;
            // console.log(color);
            str.color = colorVariation[Math.round(color)];
            // console.log(str);
            return str;
    }
    
}

function dataRemove(userName, path, oCoords, pageNum, text){
    if(Pages.has(pageNum)){
        let userMap = new Map();
        userMap = Pages.get(pageNum);
        let texts = [];
        texts = userMap.get(userName);
        let newArray = [];
        texts.forEach(element => {
            if (element.text.str !== text.str) {
                newArray.push(element);
            } else {
                if (element.path.length !== path.length) {
                    newArray.push(element);
                } 
            }
        });
        userMap.set(userName,texts);
        Pages.set(pageNum,userMap);
    }

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
exports.analysOne = analysOne;
exports.dataRemove = dataRemove;