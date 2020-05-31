const server = require('./app');

const PORT = process.env.PORT || 3001;

server.listen(PORT, '192.168.43.25', () => {
    console.log(`server listening on ${PORT}`)
});
