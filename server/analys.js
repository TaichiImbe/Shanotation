let chroma = require('chroma');
let colorsys = require('colorsys');
// var annotasions = ['enclosure','line'];
//識別
let identifier = ['enclosure', 'line'];

/**
 * Pages は ページごとにipとpathのmapを管理する
 * 2019/11/04 変更 ページごとにユーザ名とpathのmapを管理
 */
let Pages = new Map();
// var textList = new Set();
let textList = new Map();
let teacherSelect = false;
let mylimit;

module.exports = {
    /**
     *送信されてきた分析データをセット
     *
     * @param {*} ip 
     * @param {*} data
     * @param {*} oCoords
     */
    dataset: (name, path, oCoords, pageNum, ident, text) => {

        let array = [];
        let page = new Map();
        if (Pages.has(pageNum)) {
            page = Pages.get(pageNum);
        }
        if (page.has(name)) {
            array = page.get(name);
        }
        text.forEach(element => {
            array.push(new datalist(name, path, oCoords, ident, element));
            // array.push(new datalist(ip, path, oCoords, ident, text));
        })
        page.set(name, array);
        Pages.set(pageNum, page);
        if (!teacherSelect) {
            module.exports.textset(text,pageNum);
        }
    },
    textset: (text, pageNum) => {
        if (textList.has(pageNum)) {
            array = textList.get(pageNum);
        text.forEach(element => {
            if (inCheck(array,element)) {
                element.count = 0;
                // textList.add(element);
                array.push(element);
            }
        });
            textList.set(pageNum,array);
        } else {
            textList.set(pageNum,text);
        }
    },
/**
 *  文字ごとに色を決める
 *
 * @param {*} page
 * @param {*} userListSize
 */
    analys: (page, userListSize) => {
        if (textList.has(page)) {
        let pList = Object.create(textList.get(page));

        // console.log(pList);
        if (Pages.has(page)) {
            let data = Pages.get(page);
            let values = data.values();
            for (i = 0; i < pList.length; i++) {
                pList[i].count = 0;
            }
            let countList = [];
            //ipごとにデータを分類する処理
            let usersData = []
            while (true) {
                let textconsider = values.next();
                if (!textconsider.done) {
                    let val = textconsider.value;
                    //同一文字の同一座標の同一ユーザの書き込みは追加しない
                    const dataCheck = function (data) {
                        for (i = 0; i < usersData.length; i++) {
                            if (usersData[i].text.str === data.text.str
                                && usersData[i].text.transform[4] == data.text.transform[4]
                                && usersData[i].text.transform[5] == data.text.transform[5]
                                && usersData[i].ip === data.ip
                            ) {
                                return false;
                            }
                        }
                        return true;
                    }
                    val.forEach(value => {
                        if (dataCheck(value)) {
                            usersData.push(value);
                        }
                    })
                } else {
                    break
                }
            }
            //分類したデータに基づいて単語情報群を用いてユーザごとに書いた文字の位置をカウント
            usersData.forEach(value => {
                for (i = 0; i < pList.length; i++) {

                    //memo pList は OK
                    if (value.text.str === pList[i].str &&
                        value.text.transform[4] == pList[i].transform[4] &&
                        value.text.transform[5] == pList[i].transform[5]) {
                        pList[i].count++;
                    }
                }
            })

            for (i = 0; i < pList.length; i++) {
                if (pList[i].count > 0) {
                    countList.push(pList[i]);
                }
            }
            //色を決める
            let list = [];
            // console.log(pList);
            // pList.forEach(function(text) {
            for (i = 0; i < countList.length; i++) {
                //書き込みごとに比率を求める
                // let parth = countList[i].count / userListSize;
                // 比率から色を決める(とりあえず決め打ち)
                // let color = parth * (colorVariation.length - 1 - 0) + 0;
                // console.log(color);
                // countList[i].color = colorVariation[Math.round(color)];
                if (mylimit) {
                    // countList[i].color = getHeatMapColor(0, mylimit, countList[i].count);
                            countList[i].color = getHeatMapColor(0, mylimit, countList[i].count);
                            countList[i].opacity = getOpacityValue(0, mylimit, countList[i].count);
                } else {
                    // countList[i].color = getHeatMapColor(0, userListSize, countList[i].count);
                            countList[i].color = getHeatMapColor(0, userListSize, countList[i].count);
                            countList[i].opacity = getOpacityValue(0, userListSize, countList[i].count);
                }
                list.push(countList[i]);
                // console.log(textList);
            }
            // console.log(list);
            return list;
        } 

        }
        return [];
    },
    /**
 * 文字列ごとに色を決める
 * 現在は使用停止
 * @param {*} page
 * @returns pathと色情報の集合
 */
    analysString: (page, userListSize) => {
        
    let map = new Map();
    if (Pages.has(page)) {
        //テキストの一文字ごとに色を決めたい
        let data = Pages.get(page);
        let iplist = data.keys();
        data.forEach(element => {
            element.forEach(value => {
                let array = []
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
        //ip(ユーザ名)ごとに合計
        // map.forEach(element => {
        let count = new Map();
        map.forEach(function (value, key) {
            // console.log(key + ' ' + value);
            let i = 0;
            //文字列ごとの配列が取れる
            //element は datalist型 
            let iplist = [];
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
        count.forEach(function (value, keys) {
            let val = count.get(keys);
            //書き込みごとに比率を求める
            let it = textList.values();
            while (true) {
                let textconsider = it.next();
                // console.log(textconsider.value);
                if (!textconsider.done) {
                    let value = textconsider.value;
                    if (value.str === keys) {
                        if (mylimit) {
                            textconsider.value.color = getHeatMapColor(0, mylimit, count.get(keys));
                        } else {
                            textconsider.value.color = getHeatMapColor(0, userListSize, count.get(keys));
                        }
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
    },
    /**
 *指定した文字列の分析結果を返す
 *現在は使用停止
 * @param {*} page
 * @param {*} text
 * @param {*} userListSize
 * @returns
 */
    analysOne: (page, text, userListSize) => {
        

    // var map = new Map();
    let array = [];
    if (Pages.has(page)) {
        let str = '';
        let data = Pages.get(page);
        let iplist = data.keys();
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
        let plist = [];
        let p = 0;
        array.forEach(element => {

            // console.log(element);
            // console.log(iplist);
            let check = function (element) {
                for (i = 0; i < iplist.length; i++) {
                    if (iplist[i] === element.ip) {
                        return false;
                    }
                }
                return true;
            }
            if (check(element)) {
                iplist.push(element.ip);
                p++;
            }
        });
        // console.log(p);
        if (mylimit) {
            str.color = getHeatMapColor(0, mylimit, p);
        } else {
            str.color = getHeatMapColor(0, userListSize, p);
        }
        // console.log(str);
        return str;
    }
    },
    dataRemove: (userName, path, oCoords, pageNum, textList) => {
        
    if (Pages.has(pageNum)) {
        let userMap = Pages.get(pageNum);
        let texts = userMap.get(userName);
        // let removeArray = [];
        if (texts) {
            textList.forEach(text => {
                let newArray = [];
                texts.forEach(rmtext => {
                    if (rmtext.text.str !== text.str) {
                        if (rmtext.text.transform[4] !== text.transform[4] &&
                            rmtext.text.transform[5] !== text.transform[5]) {
                            newArray.push(rmtext);
                        } else {
                            if (rmtext.oCoords.bl.x !== oCoords.bl.x &&
                                rmtext.oCoords.bl.y !== oCoords.bl.y) {
                                newArray.push(rmtext);
                            }
                            // removeArray.push(rmtext);
                        }
                    } else {
                        if (rmtext.text.transform[4] !== text.transform[4] &&
                            rmtext.text.transform[5] !== text.transform[5]) {
                            newArray.push(rmtext);
                        } else {
                            if (rmtext.oCoords.bl.x !== oCoords.bl.x &&
                                rmtext.oCoords.bl.y !== oCoords.bl.y) {
                                newArray.push(rmtext);
                            }
                            // removeArray.push(rmtext);
                        }
                    }
                });
                texts = newArray;
            });
            userMap.set(userName, texts);
            Pages.set(pageNum, userMap);
        }


    }
    },
    /**
    *ユーザが消した文字列をanalysデータからも削除
    * 現在は使用停止
    * @param {*} userName
    * @param {*} path
    * @param {*} oCoords
    * @param {*} pageNum
    * @param {*} text
    */
    dataRemoveString: (userName, path, oCoords, pageNum, text) => {
        if (Pages.has(pageNum)) {
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
            userMap.set(userName, newArray);
            Pages.set(pageNum, userMap);
        }
    },
    /**
    * ユーザがクリアボタンを押した時の処理
    * 
    * @param {*} name
    * @param {*} pageNum
    */
    dataClear: (name, pageNum) => {
        if (pageNum) {

            if (Pages.has(pageNum)) {
                let userMap = Pages.get(pageNum);
                if (userMap.has(name)) {
                    let newArray = [];
                    userMap.set(name, newArray);
                }
                Pages.set(pageNum, userMap);
            }
        } else {
            for ([key, value] of Pages) {
                if (value.has(name)) {
                    let newArray = [];
                    value.set(name, newArray);
                }
            }
        }
    },
    /**
     * 上限値の設定
     */
    setLimit: (limit) => {
        mylimit = limit;
    },
    setTeacherSelection: (select) => {
        teacherSelect = select
    },
}

const inCheck = (array,text) => {
    for (i = 0; i < array.length; i++) {
        if (array[i].str === text.str) {

            if (array[i].transform[4] == text.transform[4] && array[i].transform[5] == text.transform[5]) {
                return false;

            }
        }
    }
    return true;
}

/**
 * 参考サイト
 * https://ja.wikipedia.org/wiki/HSV色空間#HSVの視覚化
 * https://www.npmjs.com/package/colorsys
 * https://mathwords.net/dataseikika
 * 0 ~ 360 の範囲で入力値を変えてあげる?
 * @param {*} min
 * @param {*} max
 * @param {*} value
 * @returns
 */
const getHeatMapColor = (min,max,value) =>{

    // let pos = Math.sin(value/max);
    // console.log('min : ' + min + ' max : ' + max + ' value : ' + value);
    let hue = ((value - min) / (max - min)) * (0 - 230) + 230;
    if (hue <= 0) {
        hue = 0;
    }
    const hsv = colorsys.parseCss('hsv(' + hue + ',100%,100%)');
    // console.log(hsv);
    // console.log(colorsys.hsv2Hex(hsv));
    return colorsys.hsv2Hex(hsv);
}
const getOpacityValue = (min = 0, max, value) => {
    return (value - max)/(min - max);
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