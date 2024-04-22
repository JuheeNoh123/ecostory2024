const express = require('express');
var router = express.Router();
const guide_model = require('../gpt/models/guide_model');
const checklist_model = require('./models/checklist_model');
const user_model = require('../signup/models/reg_model');

const sum = [];
const final_list = [];

async function randomInt(min, max){ 
    // console.log("min: ", min);
    // console.log("max: ", max);
    var randomNum = Math.floor(Math.random()*(max-min+1)) + min; 
    return randomNum;
}

async function shuffle(array) {
    for (let index = array.length - 1; index > 0; index--) {
      // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
      const randomPosition = Math.floor(Math.random() * (index + 1));
  
      // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
      const temporary = array[index];
      array[index] = array[randomPosition];
      array[randomPosition] = temporary;
    }
}
  
async function splitweeks(final_list){
    let transformedData = [];
    const groupedByFive = [];
    let count = 1;

    for (let i = 0; i < final_list.length; i += 5) {
        const group = {};
        group[count++] = final_list.slice(i, i + 5).map((item, index) => ({[`${index + 1}`]: item.guide_NM}));
        groupedByFive.push(group);
    }
    
    transformedData = JSON.stringify(groupedByFive);
    return transformedData;

}

router.post('/makeplan', async(req,res)=>{
    /*
    req
    {
        "userid":"njh",
        "checklist":{
            "category_Id" : {15,16}
            "guide_id" : {1,2,3,4,5,6,7,8,9}
        }
        
    }
    */
    const guide_list = req.body.checklist.guide_Id;
    const listcnt= guide_list.length;
    const category_Id = req.body.checklist.category_Id;
    const category_cnt = category_Id.length;
    
    for(let i=0;i<guide_list.length;i++){
        let guide = new guide_model();
        const add_guideNM = await guide.findwithguideId(guide_list[i]);
        final_list.push(add_guideNM[0][0]);
    }

    if(listcnt<25){
        for(let i=0;i<category_cnt;i++){
            let guide = new guide_model('', category_Id[i]); 
            const extra_guide = await guide.findwithcategoryId();
            const pr_extra_guide = extra_guide[0];
            //console.log(pr_extra_guide);        //배열 이쁘게 만들어주기
            sum.push(pr_extra_guide);       //하나의 배열로 합쳐주기
        }
        let cnt = 0;
        while(cnt<(25-listcnt)){
            const idx1 = await randomInt(0, category_cnt-1);
            const idx2 = await randomInt(0, sum[idx1].length-1);
            console.log(idx1, idx2);
            cnt++;
            final_list.push(sum[idx1][idx2]);
        }
    }
    console.log("전\n",final_list);

    await shuffle(final_list);

    //console.log('후\n',final_list);
    //console.log(final_list.length);
    
    const transformedData = await splitweeks(final_list);
    res.send(transformedData);
    
})

router.post('/delete', async(req,res)=>{
/*
[
  { week: 1, guide_Id: 2 },
  { week: 2, guide_Id: 3 },
  { week: 2, guide_Id: 4 }
]
*/
    const ans = req.body;
    const guide = new guide_model;
    
    for(let i=0;i<ans.length;i++){
        const delete_Id = ans[i].guide_Id;
        let idx = await randomInt(1, 224);
        let new_NM = await guide.findwithguideId(idx);
        console.log(new_NM[0][0]);
        while(new_NM[0][0] == undefined || idx == delete_Id){
            idx = await randomInt(1, 224);
            new_NM = await guide.findwithguideId(idx);
            console.log(idx);
        }
        console.log(new_NM[0][0]);
        ans[i].guide_Id = await guide.findwithguide_NM(new_NM[0][0].guide_NM);
        ans[i].guide_NM = new_NM[0][0];
    }
    

    const transformedData = ans.map(item => ({
        week: item.week,
        guide_Id: item.guide_Id[0][0].guide_Id,
        guide_NM: item.guide_NM.guide_NM
      }));

    res.send(transformedData); 
})

router.post('/save', async(req, res)=>{
/*
   {
        "userId" : "njh",
                "list" : [
                {
                        "1": [5,7,10,33,65 ]
                },
                {
                        "2": [6,8,11,44,74]
                },
                ...
        ]
}
*/
    const requserId = req.body.userId;
    const reqlist = req.body.list;
    const reqdate = req.body.date;
    const resjson = {};
    resjson.userId = requserId;
    resjson.date = reqdate;
    resjson.list = [];
    console.log(resjson)
    
    const user = new user_model(requserId);

    console.log("resuserId : ",requserId);
    console.log("reslist : ",reqlist);

    let find_userId = await user.findId();
    let userId = find_userId[0][0].id;
    let IsWeekList1 = false;
    let IsWeekList2 = false;
    let IsWeekList3 = false;
    let IsWeekList4 = false;
    let IsWeekList5 = false;
    //console.log(userId);
    for(let i = 0; i<5; i++){
        let jsonObject = reqlist[i];
        let keys = Object.keys(jsonObject);
        let weekNM = keys[0];
        let WeekListID = jsonObject[weekNM];
        const checklist = new checklist_model(userId,reqdate, weekNM,
                            WeekListID[0], IsWeekList1,
                            WeekListID[1], IsWeekList2,
                            WeekListID[2], IsWeekList3,
                            WeekListID[3], IsWeekList4,
                            WeekListID[4], IsWeekList5);
        await checklist.save();

        
        const guide = new guide_model();
        
        let guideList = {};
        
        guideList[weekNM] = [];
        for (let i = 0;i<5;i++) {
            let guidedetail = {};
            let guide_Id = WeekListID[i];
            let guide_NM = await guide.findwithguideId(guide_Id);
            guidedetail.guideId = guide_Id;
            guidedetail.guideNM = guide_NM[0][0].guide_NM;
            console.log("guidedetail :", guidedetail);
            guideList[weekNM].push(guidedetail);
        }
        //console.log(guideList);
        resjson.list.push(guideList);
        //console.log(resjson);
        //console.log(A);
    }
    

    //console.log(resjson);    
    
    return res.send(resjson);
})
module.exports = router;