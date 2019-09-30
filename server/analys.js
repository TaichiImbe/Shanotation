var annotasions = ['underline', 'enclosure'];
var Datas = new Map();

function dataset(ip,data) {
    var array = new Array();
    if (Datas.has(ip)) {
        array = Datas.get(ip);
    }
    array.push(data);
    Datas.set(ip, array);
}

exports.dataset = dataset;