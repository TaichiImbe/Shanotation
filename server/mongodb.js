const mongodb = require('mongodb');
const assert = require('assert');

const MongoClient = mongodb.MongoClient;

let _client = null;
let _db = null;
module.exports = {
    Connect: (url,dbName)=>{
        return new Promise((resolve, reject) => {
            if (!url) {
                
            }
            MongoClient.connect(url, {
                useUnifiedTopology: true,
                useNewUrlParser:true
            }, (err, client) => {
                assert.equal(null, err);
                    _client = client;
                    _db = _client.db(dbName);
            })
        })
    },
    Insert: (name,data,callback) => {
        return new Promise((resolve, reject) => {
            const collection = _db.collection(name);
            collection.insertMany(data, (err, result) => {
                assert.equal(err, null);
                if (callback) callback(result);
            })
        })
    },
    Update: (name, findData, data,callback) => {
        return new Promise((resolve, reject) => {
            const collection = _db.collection(name);
            collection.updateMany(findData, { $set:data }, (err, result) => {
                assert.equal(err, null);
                if (callback) callback(result);
            })
        })
    },
    Find: (name,query,callback) => {
        return new Promise((resolve, reject) => {
            const collection = _db.collection(name);
            collection.find(query).toArray((err, docs) => {
                assert.equal(err, null);
                callback(docs);
            })
        });
    },
    FindOne: (name,query,callback) => {
        return new Promise((resolve, reject) => {
            const collection = _db.collection(name);
            collection.findOne(query,(err, docs) => {
                assert.equal(err, null);
                callback(docs);
            })
        });
    },
    Delete: (name, query, callback) => {
        return new Promise((resolve, reject) => {
            const collection = _db.collection(name);
            collection.deleteMany(query, (err, docs) => {
                assert.equal(err, null);
                if(callback) callback(docs);
            })
        })
    },
    DeleteOne: (name, query, callback) => {
        return new Promise((resolve, reject) => {
            const collection = _db.collection(name);
            collection.deleteOne(query, (err, docs) => {
                assert.equal(err, null);
                if(callback) callback(docs);
            })
        })
    },
    Close: () => {
        return new Promise((resolve, reject) => {
            _client.close();
        })
    },
}
