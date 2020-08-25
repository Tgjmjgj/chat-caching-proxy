const express = require('express');
const http  = require('http')
const redis = require('redis');
const requestProxy = require('express-request-proxy');
const proxy = require('express-http-proxy');
const apicache = require('apicache');

const app = express();

// app.all(
//   '/clientweb/api/v1/*',
//   requestProxy({
//     cacheMaxAge: 300,
//     url: 'https://ocean08.brightpattern.com/clientweb/api/v1/*',
//   }),
// );

// app.get(
//     '/*',
//     requestProxy({
//         cacheMaxAge: 300,
//         url: 'https://surflychat.web.app/*',
//     }),
// );

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
