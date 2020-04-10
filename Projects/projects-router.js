const express = require('express');
const router = express.Router();
const db = require('../data/helpers/projectModel')

router.get('/', (req,res)=>{
    res.status(200).json({message: 'the projects endpoint is working'})
})

router.get('/:id', projectsIdValidation, (req,res)=>{
    const id = req.params.id;
    db.get(id)
    .then(object => {
        res.status(200).json(object)
    })
    .catch(err => {
        res.status(500).json('could not access the database to get info on that project with that id')
    })
})

router.get('/:id/actions' ,projectsBodyValidation , (req,res)=>{
    const id = req.params.id;
    db.getProjectActions(id)
    .then(actions=> {
        if(actions.length > 0){
            res.status(200).json(actions)
        }else{
            res.status(400).json({message: 'this project does not have any actions '})
        }
    })
    .catch(err => {
        res.status(500).json({message: 'could not get the actions for that project from the database'})
    })

})

router.post('/', projectsBodyValidation, (req,res)=>{
    const project = req.body;
    db.insert(project)
    .then(returnedProject => {
        res.status(201).json(returnedProject)
    })
    .catch(err => {
        res.status(500).json({message: 'could not add the project to the database'})
    })
})

router.put('/:id',projectsIdValidation, projectsBodyValidation, (req, res)=> {
    const id = req.params.id;
    const updatedProject = req.body;
    db.update(id, updatedProject)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        res.status(500).json({message: 'could not update the project in gthe database'})
    })
} )

router.delete('/:id', projectsIdValidation, (req, res)=>{
    const id = req.params.id;
    const project = req.project;
    db.remove(id)
    .then(del => {
        if(del > 0 ){
            res.status(200).json(project)
        }else{ 
            res.status(400).json({message: 'project was not deleted'})
        }
    })
    .catch(err => {
        res.status(500).json({message: 'could not delete that project from the database'})
    })
})

//middleware for the projects endpoints 
function projectsIdValidation(req, res, next){
    const id = req.params.id;
    db.get(id)
    .then(object => {
        if(object !== null ){
            req.project = object;
           return next()
        }else{
            return req.status(400).json({message: 'a project with that does not exist'})
        }
    }).catch(err => {
        res.status(400).json({message: "a project with that id does not exist"})
    })
}

function projectsBodyValidation(req,res,next){
    const body = req.body;
    if(body.name && body.description){
        next();
    }else{
        res.status(404).json({messgae: 'need to included both a name and description in the body of the request'})
    }
}


module.exports = router;
