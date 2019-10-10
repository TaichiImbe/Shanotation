var annotasions = ['underline', 'enclosure'];
var Datas = new Map();

/**
 *送信されてきた分析データをセット
 *
 * @param {*} ip 
 * @param {*} data
 * @param {*} oCoords
 */
function dataset(ip,data,oCoords) {
    var array = new Array();
    if (Datas.has(ip)) {
        array = Datas.get(ip);
    }
    array.push(data);
    Datas.set(ip, array);
    // console.log(Datas);
}

exports.dataset = dataset;