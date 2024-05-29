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
    let transformedData = {
        "list":[]
    };

    let count = 1;

    for (let i = 0; i < final_list.length; i += 5) {
        const group = {};
        group[count++] = final_list.slice(i, i + 5);
        transformedData.list.push(group);
    }
    
    return transformedData;

}


async function save(list,date, user_Id){
    /*
    [
        { '1': [ 612, 572, 614, 445, 429 ] },
        ...
    ]
    */
    const user = new user_model(user_Id,'','');
    let userId = await user.findId();
    console.log(userId);
    userId = userId['id']
    console.log(userId);

    let IsWeekList1 = false;
    let IsWeekList2 = false;
    let IsWeekList3 = false;
    let IsWeekList4 = false;
    let IsWeekList5 = false;
    console.log(list);
    for(let i = 0; i<5; i++){
        let jsonObject = list.list[i];
        console.log("jsonObject",jsonObject);
        let keys = Object.keys(jsonObject);
        let weekNM = keys[0];
        let WeekListID = jsonObject[weekNM];
        const checklist = new checklist_model(userId,date, weekNM,
                            WeekListID[0], IsWeekList1,
                            WeekListID[1], IsWeekList2,
                            WeekListID[2], IsWeekList3,
                            WeekListID[3], IsWeekList4,
                            WeekListID[4], IsWeekList5);
        await checklist.save();
    }
    
}

//나의 한달 체크리스트 출력
async function show_checklist(userId, date){
    const checklist = new checklist_model(userId,date);
    const guide = new guide_model();
    let check = await checklist.find();
    const week = []
    
    console.log(check);
    
    for(let i=0;i<5; i++){
        const weekGuides = [];
        for(let j=1; j<=5;j++){
            let guide_Id = await guide.findwithguideId(check[0][i][`WeekListID${j}`]);
            weekGuides.push({
                guideId: check[0][i][`WeekListID${j}`],
                guideNM: guide_Id[0][0].guide_NM
            });
            
        }
        let weekEntry = {};
        weekEntry[i + 1] = weekGuides;  // Computed property name
        week.push(weekEntry);
    }
    // week.push({
    //     sidebar:week[now_week]
    // })
    console.log(check[0]);
    console.log(week);
    return week;
}
router.post('/makeplan', async(req,res)=>{
    /*
    {
		"userId":"njh",
		"date":5,
		"week":1,
        "checklist":{
            "category_Id" : [100,102,106],
            "guide_Id" : [427,428,429,447,448,449,571,572,569,612,614]
        }
    }
    */
    const userId = req.body.userId;
    const date = req.body.date;
    console.log(userId);
    let user = new user_model(userId);
    let Isuser = await user.find();
    if(!Isuser){
        res.send("등록되지 않은 ID 입니다.");
    }
    const guide_list = req.body.checklist.guide_Id;
    const listcnt= guide_list.length;
    const category_Id = req.body.checklist.category_Id;
    const category_cnt = category_Id.length;
    
    for(let i=0;i<guide_list.length;i++){
        console.log(guide_list[i]);
        final_list.push(guide_list[i]);
    }
    console.log(final_list)
    if(listcnt<25){
        for(let i=0;i<category_cnt;i++){
            let guide = new guide_model('', category_Id[i]);
            const extra_guide = await guide.findwithcategoryId();
            console.log(extra_guide);
            sum.push(extra_guide);
        }
        console.log(sum)
        let cnt = 0;
        while(cnt<(25-listcnt)){
            const idx1 = await randomInt(0, category_cnt-1);
            const idx2 = await randomInt(0, sum[idx1].length-1);
            console.log(idx1, idx2);
            cnt++;
            final_list.push(sum[idx1][idx2].guide_Id);
        }
    }
    console.log("전\n",final_list);

    await shuffle(final_list);

    console.log('후\n',final_list);
    //console.log(final_list.length);
    
    const splitData_list = await splitweeks(final_list);

    await save(splitData_list, date, userId);

    const week = req.body.week;
    const sidebar = splitData_list.list[week-1];   // guide_nm으로 불러와야함

    
    console.log(sidebar);

    res.send(sidebar);
    
})

router.post('/delete', async(req,res)=>{
/*
{
	"userid":"njh",
	"month":5,
	
	"list":[
		{
        "week" : 3,
        "guide_Id" : 46
    },
		{
				"week" : 2,
				"guide_Id" : 1
		},
		{
				"week" : 2,
				"guide_Id" : 2
		},
	  {
				"week" : 5,
				"guide_Id" : 3
		},
	  {
				"week" : 3,
				"guide_Id" : 4
		}
	]	
}
*/
    const del_list = req.body.list;
    let userID = req.body.userId;
    const date = req.body.month;
    const now_week = req.body.now_week;
    const guide = new guide_model();
    const user= new user_model(userID,'','');
    const checklist = new checklist_model();

    userID = await user.findId();
    for(let i=0;i<del_list.length;i++){
        const delete_Id = del_list[i].guide_Id;
        const week = del_list[i].week;
        let idx = await randomInt(427, 614);
        let new_NM = await guide.findwithguideId(idx);
        console.log(new_NM[0][0]);
        while(new_NM[0][0] == undefined || idx == delete_Id){
            idx = await randomInt(427, 614);
            new_NM = await guide.findwithguideId(idx);
            console.log(idx);
        }
        console.log("new_NM[0][0]",new_NM[0][0]);
        //del_list[i].guide_Id = idx;
        // del_list[i].guide_NM = new_NM[0][0];
        console.log(userID.id, date, week, delete_Id, idx)
        await checklist.change(userID.id, date, week, delete_Id, idx);
        //
    }
    
    const ans = await show_checklist(userID.id, date);
    console.log(ans);
    res.send(ans); 
})

// router.post('/save', async(req, res)=>{
// /*
//    {
//         "userId" : "njh",
//                 "list" : [
//                 {
//                         "1": [5,7,10,33,65 ]
//                 },
//                 {
//                         "2": [6,8,11,44,74]
//                 },
//                 ...
//         ]
// }
// */
//     const requserId = req.body.userId;
//     const reqlist = req.body.list;
//     const reqdate = req.body.date;
//     const resjson = {};
//     resjson.userId = requserId;
//     resjson.date = reqdate;
//     resjson.list = [];
//     console.log(resjson)
    
//     const user = new user_model(requserId);

//     console.log("resuserId : ",requserId);
//     console.log("reslist : ",reqlist);

//     let find_userId = await user.findId();
//     let userId = find_userId[0][0].id;
//     let IsWeekList1 = false;
//     let IsWeekList2 = false;
//     let IsWeekList3 = false;
//     let IsWeekList4 = false;
//     let IsWeekList5 = false;
//     //console.log(userId);
//     for(let i = 0; i<5; i++){
//         let jsonObject = reqlist[i];
//         let keys = Object.keys(jsonObject);
//         let weekNM = keys[0];
//         let WeekListID = jsonObject[weekNM];
//         const checklist = new checklist_model(userId,reqdate, weekNM,
//                             WeekListID[0], IsWeekList1,
//                             WeekListID[1], IsWeekList2,
//                             WeekListID[2], IsWeekList3,
//                             WeekListID[3], IsWeekList4,
//                             WeekListID[4], IsWeekList5);
//         await checklist.save();

        
//         const guide = new guide_model();
        
//         let guideList = {};
        
//         guideList[weekNM] = [];
//         for (let i = 0;i<5;i++) {
//             let guidedetail = {};
//             let guide_Id = WeekListID[i];
//             let guide_NM = await guide.findwithguideId(guide_Id);
//             guidedetail.guideId = guide_Id;
//             guidedetail.guideNM = guide_NM[0][0].guide_NM;
//             console.log("guidedetail :", guidedetail);
//             guideList[weekNM].push(guidedetail);
//         }
//         //console.log(guideList);
//         resjson.list.push(guideList);
//         //console.log(resjson);
//         //console.log(A);
//     }
    

//     //console.log(resjson);    
    
//     return res.send(resjson);
// })

router.post('/checklist', async(req,res)=>{
    let userID = req.body.userId;
    const user= new user_model(userID,'','');
    userID = await user.findId();
    let date = req.body.month;
    // let now_week = req.body.now_week;
    let ans = await show_checklist(userID.id, date);
    res.send(ans);
})

router.post('/sidebar', async(req, res)=>{
    const week = req.body.week;
    const date = req.body.month;
    let user = req.body.userId;
    console.log(user, date, week)
    const usermodel = new user_model(user);
    user = await usermodel.findId();
    console.log(user)
    const checklist = new checklist_model(user.id, date, week);
    let ans = await checklist.sidebar();
    res.send(ans[0][0]);

})

/*
{
	"userId":"njh",
	"month":5,
	"week":1,
	"IsWeekList1": 1,
	"IsWeekList2": 0,
	"IsWeekList3": 0,
	"IsWeekList4": 0,
	"IsWeekList5": 0
}
*/
router.put('/savesidebar', async(req,res)=>{
    let userId = req.body.userId;
    const month = req.body.month;
    const week = req.body.week;

    const IsWeekList1 = req.body.IsWeekList1;
    const IsWeekList2 = req.body.IsWeekList2;
    const IsWeekList3 = req.body.IsWeekList3;
    const IsWeekList4 = req.body.IsWeekList4;
    const IsWeekList5 = req.body.IsWeekList5;
    
    const user = new user_model(userId,'','')
    userId = await user.findId();
    userId = userId.id;
    
    const checklist = new checklist_model(userId, month, week, 
                        '',IsWeekList1,
                        '',IsWeekList2,
                        '',IsWeekList3,
                        '',IsWeekList4,
                        '',IsWeekList5,)
    
    const ans = await checklist.updateIsweekList();
    console.log(ans);
    res.send('OK');
})


module.exports = router;