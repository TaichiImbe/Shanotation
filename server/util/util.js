
module.exports = {
    getNowTime: () => {
        let time = new Date();
        let y = time.getFullYear();
        let m = ("00" + (time.getMonth() + 1)).slice(-2);
        let d = ("00" + time.getDate()).slice(-2);
        let hh = ("00" + time.getHours()).slice(-2);
        let mm = ("00" + time.getMinutes()).slice(-2);
        let ss = ("00" + time.getSeconds()).slice(-2);
        return y + "/" + m + "/" + d + " " + hh + ":" + mm + ":" + ss
    },
    timeConvert: (timeS) => {
        let time = new Date(timeS * 1);
        let y = time.getFullYear();
        let m = ("00" + (time.getMonth() + 1)).slice(-2);
        let d = ("00" + time.getDate()).slice(-2);
        let hh = ("00" + time.getHours()).slice(-2);
        let mm = ("00" + time.getMinutes()).slice(-2);
        let ss = ("00" + time.getSeconds()).slice(-2);

        return y + "/" + m + "/" + d + " " + hh + ":" + mm + ":" + ss
    }
}