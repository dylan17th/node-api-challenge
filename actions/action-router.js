const express = require('express');
const router = express.Router();
const db = require('../data/helpers/actionModel')

router.get('/', (req,res)=>{
    db.get()
    .then(arr => {
        res.status(200).json(arr)
    })
    .catch(err=> {
        res.status(500).json({message: 'could not get all the actions from the database'})
    })
})

router.get('/:id',actionsIdValidation, (req,res)=>{
    const action = req.action;
    res.status(200).json(action)
})

router.post('/' , actionBodyValidation , (req , res)=> {
    const theAction = req.body;
    db.insert(theAction)
    .then( action => {
        res.status(201).json(action)
    })
    .catch(err => {
        res.status(500).json({message: 'could not create that action for that project'})
    })
})

router.put('/:id', actionsIdValidation, actionBodyValidationForUpdate, (req,res)=> {
    const id = req.params.id;
    const updatedAction = req.body;
    db.update(id, updatedAction)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {res.staus(500).json({message: `Could not update the action with the id of ${id}`})
})})

router.delete('/:id', actionsIdValidation, (req,res)=> {
    const id = req.params.id;
    const action = req.action;
    db.remove(id)
    .then(number => {
        if(number > 0){
            res.status(200).json(action)
        }else{
            res.status(400).json({message: 'the id of the action was found but the action was not deleted'})
        }
    })
    .catch( err => {
        res.status(500).json({message: 'could not remove the action for the database'})
    })
} )

//middleware for the actions endpoints
function actionsIdValidation(req, res, next){
    const id = req.params.id;
    db.get(id)
    .then(object => {
        if(object !== null ){
            req.action = object;
           return next()
        }else{
            return req.status(400).json({message: 'an action with that does not exist'})
        }
    }).catch(err => {
        res.status(400).json({message: "an action with that id does not exist"})
    })
}

function actionBodyValidation(req,res,next){
    const body = req.body;
    if(body.project_id && body.description && body.notes){
        next();
    }else{
        res.status(404).json({messgae: 'need to included project_id, description and notes in the body of the request'})
    }
}

function actionBodyValidationForUpdate(req,res,next){
    const body = req.body;
    if(body.description && body.notes){
        next();
    }else{
        res.status(404).json({messgae: 'need to included description and notes in the body of the request'})
    }
}


module.exports = router;