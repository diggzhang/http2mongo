"use strict";

/*
 * on-finished - execute a callback when a request closes, finishes, or errors
 * mongorito   - based on mongodb native driver
 * moment      - get unix timestamp
 */
const onFinished = require("on-finished");
const mongorito = require('mongorito');
const moment = require('moment');
const Model = mongorito.Model;

/*
 * create one mongo instance return as Promise
 */
module.exports = function (mongoInstance) {
    let host = mongoInstance.host || "localhost";
    let port = mongoInstance.port || 27017;
    let db = mongoInstance.db || "httplog";
    let appTag = mongoInstance.apptag || "default";
    const mongolink = "mongodb://" + host + ":" + port + "/" + db;
    console.log("log database connected to: " + mongolink);
    mongorito['apptag'] = appTag;
    return mongorito.connect(mongolink);
};

/*
 * http sniffer function
 */
module.exports.logSniffer = function () {
    let Log = Model.extend({
        collection: 'httplogs'
    });

    let tagname = mongorito['apptag'];
    return function *logSniffer(next) {

        let err;
        let onResponseFinished = function () {
            let logMsg = {
                apptag: tagname,
                url: this.request.href,
                method: this.request.method,
                status: this.status,
                request: this.request.body,
                response: this.response.body,
                ua: this.header['user-agent'],
                ip: this.header['remoteip'],
                eventTime: moment().valueOf(),
            };

            if (this.header['authorization'] != undefined) {
                logMsg['token'] = this.header['authorization'];
            } else {
                logMsg['token'] = undefined;
            }

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
