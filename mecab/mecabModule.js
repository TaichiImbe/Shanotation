const MeCab = require('mecab-async');
const mecab = new MeCab();

MeCab.command = "mecab -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd"


module.exports = {
    Object_parse: (str) => {
        return new Promise((resolve) => {
            MeCab.parseFormat(str, (err, parseString) => {
                const object_str = parseString.filter(x => x.lexical === '名詞');
                // console.log(object_str)
                resolve(object_str);
            })
        })
    }
}

