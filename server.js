const express = require('express');
const http  = require('http')
const proxy = require('express-http-proxy');
const apicache = require('apicache');

const app = express();

const cache = apicache.middleware;
apicache.options({
    debug: true,
    appendKey: (req, res) => req.protocol + '://' + req.get('host') + req.originalUrl,
});

app.use(cache('5 minutes'));

app.use('/', proxy('https://ocean08.brightpattern.com/', {
    filter: (req, res) => req.originalUrl.startsWith('/clientweb/api/v1/'),
}));

app.use('/', proxy('https://surflychat.web.app/'));

http.createServer({}, app)
.listen(3210, () => console.log('Server started at http://localhost:3210/'));
