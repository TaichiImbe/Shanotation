const mysql = require('mysql');
const fs = require('fs');
const database = JSON.parse(fs.readFileSync('../config/database.json', 'utf-8'));
console.log(database);
let connection = mysql.createConnection(database);

let con_start = function () {
    connection.connect();
}

let userAuthen = function (username, password) {
    let sql =
        'SELECT username,password from userinfo where username=' + username + 'AND password=' + password;
    connection.query(sql, (error, results, field) => {
        if (error) throw error;

    });
}

let select = function () {
    connection.query(
        'SELECT * from userinfo', (error, results, field) => {
        if (error) throw error;
        console.log(results);
    });
}

let HandWrinteinsert = function (tableName,userName,path,color,pagenum,filename,identifier,date,time) {
    connection.query(
        'INSERT INTO ' + tableName +
        'VALUES (?),(?),(?),(?),(?),(?),(?)', [userName,path,color,pagenum,filename,identifier,date,time]
        , (error, results, field) => {
            if (error) throw error;
        });
}

let con_exit = function () {
    connection.end();
}

exports.con_start = con_start;
exports.con_exit = con_exit;