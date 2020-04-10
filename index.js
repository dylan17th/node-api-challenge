const server = require('./api/server');
const port = 6000;

server.listen(port , ()=> {
    console.log(`listening on port ${port}`)
})