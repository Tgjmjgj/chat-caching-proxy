const express = require('express');
const http  = require('http')
const redis = require('redis');
const requestProxy = require('express-request-proxy');

require('redis-streams')(redis);
const redisClient = redis.createClient();

const app = express();

app.all(
  '/clientweb/api/v1/*',
  requestProxy({
    cache: redisClient,
    cacheMaxAge: 300,
    url: 'https://ocean08.brightpattern.com/clientweb/api/v1/*',
  }),
);

app.get(
    '/*',
    requestProxy({
        cache: redisClient,
        cacheMaxAge: 300,
        url: 'https://surflychat.web.app/*',
    }),
);

http.createServer({}, app)
.listen(3210, () => console.log('Server started at http://localhost:3210/'));
