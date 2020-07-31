const utils = {
    /*https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date */
    getNowTime : function (unixTime) {
        let time = new Date();
        if (unixTime != null) {
            time = new Date(unixTime);
            let y = time.getFullYear();
            let m = ("00" + (time.getMonth() + 1)).slice(-2);
            let d = ("00" + time.getDate()).slice(-2);
            let hh = ("00" + time.getHours()).slice(-2);
            let mm = ("00" + time.getMinutes()).slice(-2);
            let ss = ("00" + time.getSeconds()).slice(-2);
            return y + "-" + m + "-" + d + "T" + hh + ":" + mm + ":" + ss
        } else {

            let y = time.getFullYear();
            let m = ("00" + (time.getMonth() + 1)).slice(-2);
            let d = ("00" + time.getDate()).slice(-2);
            let hh = ("00" + time.getHours()).slice(-2);
            let mm = ("00" + time.getMinutes()).slice(-2);
            let ss = ("00" + time.getSeconds()).slice(-2);
            return y + "/" + m + "/" + d + " " + hh + ":" + mm + ":" + ss
        }
    }

}