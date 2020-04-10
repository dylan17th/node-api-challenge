const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.status(200).json({message: 'endpoint for the actions is working correctly'})
})

module.exports = router;