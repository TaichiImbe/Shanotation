export function getSubString(object, text) {
    const oCoords = object.oCoords;
    let str = "";
    let sum = 0;
    for (let item of text.items) {
        sum += item.height;
    }

    const thresh = sum / text.items.length;
    let subtextlist = [];
    let subsubtextlist = [];
    for (let item of text.items) {
        if (
        oCoords.bl.y - thresh * 1.5 <= item.transform[5] && item.transform[5] <= oCoords.bl.y + (thresh / 2)) {
            if (item.transform[5] >= oCoords.tl.y) {
                subsubtextlist.push(item);
            }
            subtextlist.push(item);
        }
    }
    if (subsubtextlist.length != 0) {
        str = subsubtextlist;
    } else if (subtextlist.length != 0) {
        str = subtextlist;
    }

    let charList = [];
    if (!str) {
        return null;
    }
    for (let text of str) {
            let t4 = text.transform[4];
            for (i = 0; i < text.str.length; i++) {
                if (
                    t4 < oCoords.bl.x && t4 + text.height >= oCoords.bl.x
                    || t4 >= oCoords.bl.x && oCoords.br.x >= t4) {
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

                }
                if (t4 > oCoords.br.x) {
                    break;
                }
                t4 += text.height;
            }
        };
    return charList;
}