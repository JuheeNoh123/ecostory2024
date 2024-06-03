const express = require('express');
var router = express.Router();

const guide_model = require('../gpt/models/guide_model');
const checklist_model = require('./models/checklist_model');
const user_model = require('../signup/models/reg_model');
/*
{
	"userId":"njh",
	"month":5,
	"WeekNumber":2	
}

[
	{
		"WeekNumber":1,
		"success": ["환경 단체 가입하여 활동하기", "일상 생활에서 필요한 생활용품을 대신하는 다양한 방법 찾아보기"],
		"fail": ["~~", ...]
	},
	{
		"WeekNumber":2,
		"success": ["환경 단체 가입하여 활동하기", "일상 생활에서 필요한 생활용품을 대신하는 다양한 방법 찾아보기"],
		"fail": ["~~", ...]
	},					 
]
*/
router.post('/show', async(req, res)=>{
    let userId = req.body.userId;   //njh
    const month = req.body.month;   //5
    const WeekNumber= req.body.WeekNumber;  //2

    const user= new user_model(userId);
    userId = await user.findId();
    userId = userId.id; //12 (njh)

    result = []

    
    const guide = new guide_model();
    for (let i=1; i<=WeekNumber; i++){
        const checklist = new checklist_model(userId, month, i);
        let mychecklist = await checklist.findAll();
        let jsoncheck = {
            "WeekNumber":i,
            "success":[],
            "fail":[]
        };
        result.push(jsoncheck);
        for(let j=1;j<=5;j++){
            let IsWeekList = mychecklist[0][0][`IsWeekList${j}`];
            if(IsWeekList==1) { result[i-1].success.push(mychecklist[0][0][`WeekListID${j}`]); }
            else {result[i-1].fail.push(mychecklist[0][0][`WeekListID${j}`]);}
        }
        
        console.log(result);
    }
    
    

    res.send("확인 중 ^^")
})

module.exports = router;