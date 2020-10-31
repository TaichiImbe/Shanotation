const mecabModule = require("./mecabModule");

const mecabmodule = require('./mecabModule');
// const text = "こんにちは世界"
// MeCab.parseFormat(text, (err,perth) => {
//     console.log(perth);
// })

let testText = "はじめまして";

mecabmodule.Object_parse(testText).then(object => {
    console.log(object);
});
