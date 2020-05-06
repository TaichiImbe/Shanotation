const Operator = require('./_operator')

module.exports = class ReplayOperator extends Operator {
    constructor() {
        super();
        this.replayDataList = new Map();
        this.teacherPageAnno = new Map();
    }
    /**
     *リプレイデータを作成
     *
     * @param {*} list
     */
    makeReplayData(list) {
        console.log(list);
        let pathList = [];
        // let plist = list[1].split(',');
        const check = ((str) => {
            return str.match(/^[-|+]?[0-9]*\.[0-9]+$|^[+|-]?[0-9]+$/) ? true : false
        })
        let subList = [];
        // plist.forEach((path) => {
        //     if (check(path)) {
        //         subList.push(Number(path));
        //     } else {
        //         if (subList.length != 0) {
        //             pathList.push(subList);
        //         }
        //         subList = [];
        //         subList.push(path);
        //         // pathList.push(path);
        //     }
        // })
        // if (subList.length != 0) {
        //     pathList.push(subList);
        // }
        // pathList = plist;
        // let pageNum = Number(list[3]);
        // let data = makePath(pathList, list[2]);
        let data = makePath(list.path,list.color)
        // let time = list[6] + " " + list[7];
        data.userName = list.userName;
        data.time = list.time;
        data.sendFlg = false;
        data.setCoords();
        data.ident = list.ident;
        if (list.ident === 'insert') {
            // if (list[0][5] === 'insert') {
            this.replaySet( data,list.pageNum);
        } else {
            this.replayRemove(list.path, list.pageNum);
        }
    }

    /**
     *リプレイ用情報の記録
     *
     * @param {*} data
     * @param {*} pageNum
     */
    replaySet(data, pageNum) {
        let list = [];
        if (this.replayDataList.has(pageNum)) {
            list = this.replayDataList.get(pageNum);
        }
        list.push(data);
        this.replayDataList.set(pageNum, list);
    }

    replayView(time) {
        global.rmflag = true;
        this.replayDataList.forEach((value, key) => {
            value.forEach(annotation => {
                let p = Date.parse(annotation.time);
                if (parseInt(Date.parse(annotation.time)) < time) {
                    if (getUserName() !== 'teacher') {
                        if (annotation.ident === 'insert') {
                            this.setPageAnnotation(annotation, key);
                        } else {
                            this.removeAnnotation(annotation, key);
                        }
                    } else {
                        if (!annotation.sendFlg) {
                            annotation.sendFlg = true;
                            this.userHigh(annotation, key, 'insert');
                        }
                    }
                } else {
                    if (getUserName() !== 'teacher') {
                        this.removeAnnotation(annotation, key);
                        if (pageNum === key) {
                            if (Canvas.getObjects().includes(annotation)) {

                                Canvas.remove(annotation);

                            }
                        }
                    } else {
                        annotation.sendFlg = false;
                        this.userHigh(annotation, key, 'delete');
                    }
                }
            })
        });
        global.rmflag = false;
        this.setCanvasAnnotation(pageNum);
    }

    replayRemove(data, pageNum) {
        if (this.replayDataList.has(pageNum)) {
            let dataList = this.replayDataList.get(pageNum);
            let newReplayData = dataList.filter(annotation => {
                return JSON.stringify(annotation.path) !== JSON.stringify(data.path);
            });
            this.replayDataList.set(pageNum, newReplayData);
        }
    }

    userHigh(annotation, page, ident) {
        if (ident === 'insert') {
            let collection = [];
            if (this.teacherPageAnno.has(page)) {
                collection = this.teacherPageAnno.get(page);
                // https://qiita.com/koyopro/items/8faced246d0d5ed921e0
                if (!collection.includes(annotation)) {
                    collection.push(annotation);
                }
            } else {
                collection.push(annotation);
            }
            getPdfText(page).then(function (text) {
                let font = getSubText(annotation, text);
                if (!annotation.pageTrans) {
                    if (font) {
                        sendObject(annotation,
                            annotation.oCoords, page, ident, font, annotation.time);
                    }
                }
            });
            this.teacherPageAnno.set(page, collection);
        }
        if (ident === 'delete') {
            if (this.teacherPageAnno.has(page)) {
                let pageData = this.teacherPageAnno.get(page);
                if (pageData.includes(annotation)) {
                    getPdfText(page).then((text) => {
                        let font = getSubText(annotation, text);
                        if (font != null) {
                            removeObject(annotation, annotation.oCoords, page, font, ident, annotation.time);
                        } else {
                            font = [];
                            removeObject(annotation, annotation.oCoords, page, font, ident, annotation.time);
                        }
                    })
                }
                let newReplayData = pageData.filter(data => {
                    ///https://marycore.jp/prog/js/array-equal/#JSON文字列による比較
                    // return JSON.stringify(annotation.path) !== JSON.stringify(data.path);
                    return annotation !== data;
                });
                this.teacherPageAnno.set(page, newReplayData);
            }
        }
    }
}
