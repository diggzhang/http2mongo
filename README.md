# http2mongo

Koa.js middleware, sniffer http request/response save to mongodb

## Not ready to use but this can run

![](https://api.travis-ci.org/diggzhang/http2mongo.svg)


## Install

`npm install --save http2mongo`

## Usage

My code is really simple and easy to use, `index.js` is best readme file.


```javascript

    const sniffer = require('http2mongo')

    app.use(cors({expose: ['Authorization']}))
    app.use(logger())
    app.use(errorTrace())
    app.use(bodyParser())
    app.use(sniffer.logSniffer())
    app.use(router.routes())

    sniffer({"host":"10.8.8.X", "port": 27017,"db":"myloooog", "apptag": "onionsMainApp"});
    app.listen(config.port);

```

## Todo

* test case
