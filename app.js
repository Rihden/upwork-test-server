const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const promMid = require("express-prometheus-middleware")



const app = express();
app.use(morgan("dev"))
app.use(cors())

app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],

    /**
     * Uncomenting the `authenticate` callback will make the `metricsPath` route
     * require authentication. This authentication callback can make a simple
     * basic auth test, or even query a remote server to validate access.
     * To access /metrics you could do:
     * curl -X GET user:password@localhost:9091/metrics
     */
    // authenticate: req => req.headers.authorization === 'mysecrettoken',
}));

app.use((req, res, next) => {
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});
app.options('*', (req, res) => {
    res.json({
        status: 200
    });
});
app.listen("3000");

app.get("/time", (req, res) => {
    console.log(req.headers.authorization)
    res.json({
        epoch: Math.floor(Date.now() / 1000)
    })
})