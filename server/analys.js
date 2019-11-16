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
// var textList = new Set();
let textList = [];

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
    let list = [];
    let width = text.height;
    let t4 = text.transform[4];
    // class CharSet{
    //     constructor(char,height,width,transform) {
    //         this.str = char;
    //         this.height = height
    //         this.width = width;
    //         this.transform = transform
    //     }
    // }
    //　配列を作ると値が変わらない
    let trans0 = text.transform[0];
    let trans1 = text.transform[1];
    let trans2 = text.transform[2];
    let trans3 = text.transform[3];
    let trans4 = text.transform[4];
    let trans5 = text.transform[5];
    for (i = 0; i < text.str.length; i++){
        let s = text.str[i];
        trans4 = t4;
        let trans = [trans0, trans1, trans2, trans3, trans4, trans5];
        list.push({str:s,height:text.height,width:width,transform:trans});
        t4 += text.height;
    }
    list.forEach(element => {
        array.push(new datalist(ip, path, oCoords, ident, element));
        // array.push(new datalist(ip, path, oCoords, ident, text));
    })
    page.set(ip, array);
    Pages.set(pageNum, page);
    // console.log(Datas);
    let inCheck = function (text) {
        // console.log(textList);
        // let it = textList.values();
        // while (true) {
        //     let textconsider = it.next();
        //     // console.log(textconsider.value);
        //     if (!textconsider.done) {
        //         let value = textconsider.value;
        //         if (value.str === text.str) {
        //             if (value.transform[4] === text.transform[4] && value.transform[5] === text.transform[5]) {
        //                 return false;
        //             }
        //         }
        //     } else {
        //         break;
        //     }

        // }
        for (i = 0; i < textList.length; i++) {
            if (textList[i].str === text.str) {
                if (textList[i].transform[4] === textList[i].transform[4] && textList[i].transform[5] === text.transform[5]) {
                    return false;

                }
            }
        }
        return true;
    }
    // console.log(inCheck(text));
    list.forEach(element => {
        if (inCheck(element)) {
            element.count = 0;
            // textList.add(element);
            textList.push(element);
        }
    });
    // if (inCheck(text)) {
    //     textList.add(text);
    // }
    // console.log(textList);
}

/**
 *  文字ごとに色を決める
 *
 * @param {*} page
 * @param {*} userListSize
 */
function copy(main) {
    let Obj = new Set();
    main.forEach(element =>{
        Obj.add(element);
    })
    return Obj;
}
function analys(page, userListSize) {
    // console.log(textList);
    // let pList = Object.assign(textList);
    let pList = Object.create(textList);
    
    // console.log(pList);
    if (Pages.has(page)) {
        let data = Pages.get(page); 
        let values = data.values();
        for(i = 0; i < pList.length; i++){
            pList[i].count = 0;
        }
        while (true) {
            let textconsider = values.next();
            if (!textconsider.done) {
                let val = textconsider.value;
                val.forEach(value => {

                for (i = 0; i < pList.length; i++){
                    if (value.text.str === pList[i].str && 
                        value.text.transform[4] == pList[i].transform[4] &&
                        value.text.transform[5] == pList[i].transform[5]) {

                        pList[i].count++;
                    }
                }
                })
            } else {
                break
            }
        }
        //todo ipごとに分ける処理?
        // data.forEach((value,key) => {
        //     let values = data.get(key);
        //     values.forEach(val => {
        //         for (i = 0; i < pList.length; i++){
        //             if (val.text.str === pList[i].str && 
        //                 val.text.transform[4] == pList[i].transform[4] &&
        //                 val.text.transform[5] == pList[i].transform[5]) {

        //                 pList[i].count++;
        //             }
        //         }
        //     })
        // });
        // console.log(pList);
        // console.log(textList);
        //todo 合計から色を決定
        //todo とりあえず割合の正規 ?
        let list = [];
        // console.log(pList);
        // pList.forEach(function(text) {
        for (i = 0; i < pList.length; i++){
            //書き込みごとに比率を求める
            let parth = pList[i].count / userListSize;
            // 比率から色を決める(とりあえず決め打ち)
            let color = parth *(colorVariation.length - 1- 0) + 0;
            // console.log(color);
                        pList[i].color = colorVariation[Math.round(color)];
                        list.push(pList[i]);  
            // console.log(textList);
        }
    // console.log(list);
        return list;
    }

}

/**
 * 文字列ごとに色を決める
 *
 * @param {*} page
 * @returns pathと色情報の集合
 */
function analysString(page,userListSize) {
    var map = new Map();
    if (Pages.has(page)) {
        //テキストの一文字ごとに色を決めたい
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
        console.log(map);
        //ip(ユーザ名)ごとに合計
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
            //mapは文字列とユーザ名のmap?
            //todo ここのデータの持ち方を変更する必要あり
            //文字に対するipの書き込みを加算すると,違う位置の同じ文字も加算される
            //countは文字列とそれを書いた人数のmap
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
            console.log(color);
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
        userMap.set(userName,newArray);
        Pages.set(pageNum,userMap);
    }

}

function dataClear(name, pageNum) {
    if (Pages.has(pageNum)) {
        let userMap = Pages.get(pageNum);
        if (userMap.has(name)) {
            let newArray = [];
            userMap.set(name, newArray);
        }
        Pages.set(pageNum, userMap);
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
exports.dataClear = dataClear;