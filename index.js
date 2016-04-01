"use strict";

/*
 * on-finished - execute a callback when a request closes, finishes, or errors
 * mongorito   - based on mongodb native driver
 */
const onFinished = require("on-finished");
const mongorito = require('mongorito');
const Model = mongorito.Model;
const Log = Model.extend({
    collection: 'logs'
});

module.exports = function (mongoInstance) {
    const mongolink = "mongodb://" + mongoInstance.host + ":" + mongoInstance.port + "/" + mongoInstance.db;
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
                status: this.status
            };

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
