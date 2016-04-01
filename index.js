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
