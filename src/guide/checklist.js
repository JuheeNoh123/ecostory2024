const express = require('express');
var router = express.Router();

const guide_model = require('../gpt/models/guide_model');
const checklist_model = require('./models/checklist_model');
const user_model = require('../signup/models/reg_model');

router.post('/show', async(req, res)=>{
    let userId = req.body.userId;
    const month = req.body.month;
    const WeekNumber= req.body.WeekNumber;

    const user= new user_model(userId);
    userId = await user.findId();
    userId = userId.id;

    result = []

    const checklist = new checklist_model(userId, month, WeekNumber);
    const guide = new guide_model();
    for (let i=1; i<=WeekNumber; i++){
        let mychecklist = await checklist.findAll();
        mychecklist[0][0];

    }
    
    

    res.send("확인 중 ^^")
})

module.exports = router;