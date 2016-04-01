# http2mongo

Koa.js middleware, sniffer http request/response save to mongodb


## Not ready to use

## Install

`npm install --save http2mongo`

## Usage

My code is really simple and easy to use, `index.js` is best readme file.


```javascript

    // step.0 open one single mongodb
    const http2mongo = require('http2mongo')
    const logMongoConfig = {host: 'localhost', port: 27017, db: 'log'}

    // step.1 require this package in middleware to create a mongodb instance
    mongoose.connection.on('connected', () => {
        console.info('Database connected')

        const logMongoInstance = http2mongo(logMongo)
        require('./middlewares')(app, logMongoInstance)

        app.listen(config.port)
        console.log('app started on port ' + config.port)
    })

    // step.2 add sniffer before app.use(router)
    app
        .use(http2mongo.logSniffer())

    ...

```

## Todo

* test case
