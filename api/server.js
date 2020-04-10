const express = require('express');
const server = express();
const projectsRouter = require('../Projects/projects-router');
const actionsRouter = require('../actions/action-router');

server.use(express.json());

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter)

server.get('/', (req,res)=>{
    res.status(200).json({message: 'api is running as planned'})
})

module.exports = server; 