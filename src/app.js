const epxress = require('express');
const http = require('http');

const userRouter = require('./routes/user');
const mediaRouter = require('./routes/media');

const app = epxress();
const server = http.createServer(app)

app.use(epxress.json())
app.use(userRouter);
app.use(mediaRouter);

module.exports = server;
