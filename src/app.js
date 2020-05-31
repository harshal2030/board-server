const epxress = require('express');
const http = require('http');

const userRouter = require('./routes/user');

const app = epxress();
const server = http.createServer(app)

app.use(epxress.json())
app.use(userRouter);

module.exports = server;
