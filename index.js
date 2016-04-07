"use strict";

/*
 * on-finished - execute a callback when a request closes, finishes, or errors
 * mongorito   - based on mongodb native driver
 */
const onFinished = require("on-finished");
const mongorito = require('mongorito');
const jwt = require('jwt-decode');
const Model = mongorito.Model;
const Log = Model.extend({
    collection: 'logs'
});

module.exports = function (mongoInstance) {
    let host = mongoInstance.host || "localhost";
    let port = mongoInstance.port || 27017;
    let db = mongoInstance.db || "httplog";
    const mongolink = "mongodb://" + host + ":" + port + "/" + db;
    console.log("log database connected to: " + mongolink);
    return mongorito.connect(mongolink);
};

module.exports.logSniffer = function () {

    return function *logSniffer(next) {
        let err;

        let onResponseFinished = function () {

            let logMsg = {
                url: this.request.href,
                request: this.request.body,
                response: this.response.body,
                method: this.request.method,
                status: this.status,
                token: this.header['authorization'],
            };

            let decodeToken = jwt(logMsg['token']);
            logMsg['decodeToken'] = decodeToken;

            let log = new Log(logMsg);
            log.save();
        };

        try {
            yield *next;
        } catch(e) {
            err = e;
        }finally {
            onFinished(this.response.res, onResponseFinished.bind(this));
        }

        if (err) {
            throw new err;
        }
    };
};

process.on('SIGINT', function () {
    mongorito.disconnect();
    console.warn('log database disconnected.')
});
