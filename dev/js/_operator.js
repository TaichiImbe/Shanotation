module.exports = class Operator {
    constructor() {
        this.pagesAnnotationsList = new Map();

    }
    setPageAnnotation(data, pageNum) {
        let dataCollection = [];
        if (Array.isArray(data)) {
            data.forEach(text => {
                dataCollection.push(text);
            });
        } else {

            if (this.pagesAnnotationsList.has(pageNum)) {
                dataCollection = this.pagesAnnotationsList.get(pageNum);
                // https://qiita.com/koyopro/items/8faced246d0d5ed921e0
                if (!dataCollection.includes(data)) {
                    dataCollection.push(data);
                }
            } else {
                dataCollection.push(data);
            }
        }
        this.pagesAnnotationsList.set(pageNum, dataCollection);

    }

    getAnnotation(pageNum) {
        return this.pagesAnnotationsList.has(pageNum) ? this.pagesAnnotationsList.get(pageNum) : [];
    }

    removeAnnotation(data, pageNum) {
        if (this.pagesAnnotationsList.has(pageNum)) {
            let pageAnnotations = this.pagesAnnotationsList.get(pageNum);
            let newReplayData = pageAnnotations.filter(annotation => {
                ///https://marycore.jp/prog/js/array-equal/#JSON文字列による比較
                // return JSON.stringify(annotation.path) !== JSON.stringify(data.path);
                return annotation != data;
            });
            this.pagesAnnotationsList.set(pageNum, newReplayData);
        }

    }

    splitText(text) {
        let charList = [];
        let t4 = text.transform[4];
        for (let i = 0; i < text.str.length; i++) {
            /*   正規表現 https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String
                半角文字のみ取得 http://2011428.blog.fc2.com/blog-entry-79.html
            */
            if (text.height > text.width) {
                charList.push({
                    dir: text.dir,
                    fontName: text.fontName,
                    height: text.height,
                    width: text.width,
                    transform: [text.transform[0], text.transform[1], text.transform[2], text.transform[3], t4, text.transform[5]],
                    str: text.str[i]
                });
            }
            else {
                charList.push({
                    dir: text.dir,
                    fontName: text.fontName,
                    height: text.height,
                    width: text.height,
                    transform: [text.transform[0], text.transform[1], text.transform[2], text.transform[3], t4, text.transform[5]],
                    str: text.str[i]
                });
            }
            t4 += text.height;
        }
        return charList;
    }

    opacityChange(pageNum, text) {

        let data = this.pagesAnnotationsList.get(pageNum);
        if (data) {
            for (let t of data) {
                t.opacity = 1;
            }
            for (let t of data) {
                for (let tx of text) {
                    let height = tx.height;
                    if (t.top === tx.transform[5] - height &&
                        t.left === tx.transform[4]) {
                        t.opacity = tx.opacity;
                    }
                }
            }
        } else {
            data = [];
            for (let tx of text) {
                data.push(makeTextHiglight(tx, '#fff', tx.opacity));
            }
        }
        console.log(data);
        this.pagesAnnotationsList.set(pageNum, data);
    }

    textFilter(pdfNumPages) {
        // getPdfOperator(global.pageNum);

        if (getUserName() === 'teacher') {
            let objectList = Canvas.getObjects();
            if (objectList.length === 0) {
                for (let pageNum = 1; pageNum <= pdfNumPages; pageNum++) {
                    getPdfText(pageNum).then((textArray) => {

                        const highLightList = []
                        for (let text of textArray.items) {
                            let charList = this.splitText(text);
                            for (let char of charList) {
                                highLightList.push(makeTextHiglight(char, '#FFF', 1));
                            }
                        }
                        this.setPageAnnotation(highLightList, pageNum);
                        this.setCanvasAnnotation(global.pageNum);
                    })

                }
            }
        }
    }

    setCanvasAnnotation(pageNum) {
        Canvas.clear();
        const Anno = this.getAnnotation(pageNum);
        if (Anno != null) {
            Anno.forEach(element => {
                // console.log(element);
                element.pageTrans = true;
                Canvas.add(element);
            });
        }

    }
}
