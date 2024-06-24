const express = require('express');
var router = express.Router();
const guide_model = require('../gpt/models/guide_model');
const checklist_model = require('./models/checklist_model');
const user_model = require('../signup/models/reg_model');
var verify = require('../signup/verify');
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



router.post('/makeplan', verify, async (req, res) => {
    try {
        const userId = req.user.userid; // req.user에서 유저 ID를 가져옵니다.
        const date = req.body.date;
        const week = req.body.week;
        const category_Id = req.body.checklist.category_Id;
        const guide_Id = req.body.checklist.guide_Id;

        console.log(userId, date, week, category_Id, guide_Id);

        // 세션에 데이터 설정
        req.session.date = date;
        req.session.week = week;
        req.session.category_Id = category_Id;
        req.session.guide_Id = guide_Id;

        // 세션 저장 후 리다이렉트
        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect(`/guide/makeplan/${userId}`);
        });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/makeplan/:userid', async (req, res) => {
    try {
        const userId = req.params.userid;
        const date = req.session.date;
        const guide_list = req.session.guide_Id;
        const category_Id = req.session.category_Id;
        const week = req.session.week;

        console.log("Session data:", { date, guide_list, category_Id, week });

        if (!date || !guide_list || !category_Id) {
            return res.status(400).send("Invalid session data");
        }

        console.log(userId);

        let user = new user_model(userId);
        let Isuser = await user.find();
        if (!Isuser) {
            return res.send("등록되지 않은 ID 입니다.");
        }

        const listcnt = guide_list.length;
        console.log("listcnt", listcnt);
        const category_cnt = category_Id.length;

        let final_list = [];
        for (let i = 0; i < guide_list.length; i++) {
            console.log("guide_list[i]", guide_list[i]);
            final_list.push(guide_list[i]);
        }
        console.log("FINAL_LIST:", final_list);
        let sum = [];

        if (listcnt < 25) {
            for (let i = 0; i < category_cnt; i++) {
                let guide = new guide_model('', category_Id[i]);
                const extra_guide = await guide.findwithcategoryId();
                console.log("extra_guide", extra_guide);
                sum.push(extra_guide);
            }

            console.log("sum", sum);
            let cnt = 0;
            while (cnt < (25 - listcnt)) {
                const idx1 = await randomInt(0, category_cnt - 1);
                const idx2 = await randomInt(0, sum[idx1].length - 1);
                console.log("idx1, idx2", idx1, idx2);
                cnt++;
                final_list.push(sum[idx1][idx2].guide_Id);
            }
        }
        console.log("전\n", final_list);

        await shuffle(final_list);

        console.log('후\n', final_list);
        //console.log(final_list.length);

        const splitData_list = await splitweeks(final_list);

        await save(splitData_list, date, userId);

        const sidebar = splitData_list.list[week - 1]; // guide_nm으로 불러와야함

        console.log("sidebar", sidebar);

        res.send(sidebar);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
});



router.delete('/delete', verify, async(req,res)=>{
    try {
        const del_list = req.body.list;
        //let userID = req.body.userId;
        let userID = req.user.userid;
        const date = req.body.month;

        // 세션에 데이터 설정
        req.session.del_list = del_list;
        req.session.date = date;

        console.log(del_list,userID,date )
        // 리다이렉트
        // 세션 저장 후 리다이렉트
        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect(`/guide/delete/${userID}`);
        });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
})

router.delete('/delete/:userid', async(req,res)=>{
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
    try{
        const del_list = req.session.del_list;
        //let userID = req.body.userId;
        let userID = req.params.userid;
        const date = req.session.date;
        console.log(del_list);
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
            
        }
        
        const ans = await show_checklist(userID.id, date);
        console.log(ans);
        res.send(ans); 
    }
    catch(error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");

    }
})

router.post('/checklist', verify, async(req,res)=>{
    try {
        const userID = req.user.userid;   //njh
        const date = req.body.month;

        // 세션에 데이터 설정
        req.session.date = date;

        console.log(userID,date )
        // 리다이렉트
        // 세션 저장 후 리다이렉트
        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect(`/guide/checklist/${userID}`);
        });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
})
router.get('/checklist/:userid', async(req,res)=>{
    try{
        let userID = req.params.userid;   //njh
        const user= new user_model(userID,'','');
        userID = await user.findId();
        let date = req.session.date;
        // let now_week = req.body.now_week;
        let ans = await show_checklist(userID.id, date);
        res.send(ans);
    }
    catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
})


router.post('/sidebar', verify, async(req,res)=>{
    try {
        let user = req.user.userid;   //njh
        const week = req.body.week;
        const date = req.body.month;

        // 세션에 데이터 설정
        req.session.date = date;
        req.session.week = week;

        console.log(user,date,week )
        // 리다이렉트
        // 세션 저장 후 리다이렉트
        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect(`/guide/sidebar/${user}`);
        });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
})
router.get('/sidebar/:userid', async(req, res)=>{
    let user = req.params.userid;   //njh
    const week = req.session.week;
    const date = req.session.date;
    //let user = req.body.userId;
    console.log(user, date, week)
    const usermodel = new user_model(user);
    user = await usermodel.findId();
    console.log(user)
    const checklist = new checklist_model(user.id, date, week);
    let ans = await checklist.sidebar();
    let user_name = await usermodel.findName();
    ans[0][0].user= user_name.name;
    let user_image = await usermodel.findImage();
    ans[0][0].image= user_image.userImage;
    res.send(ans[0][0]);

})


router.put('/savesidebar', verify, async(req,res)=>{
    try {
        let userId = req.user.userid;   //njh
        const month = req.body.month;
        const week = req.body.week;

        const IsWeekList1 = req.body.IsWeekList1;
        const IsWeekList2 = req.body.IsWeekList2;
        const IsWeekList3 = req.body.IsWeekList3;
        const IsWeekList4 = req.body.IsWeekList4;
        const IsWeekList5 = req.body.IsWeekList5;

        // 세션에 데이터 설정
        req.session.month = month;
        req.session.week = week;

        req.session.IsWeekList1 = IsWeekList1;
        req.session.IsWeekList2 = IsWeekList2;
        req.session.IsWeekList3 = IsWeekList3;
        req.session.IsWeekList4 = IsWeekList4;
        req.session.IsWeekList5 = IsWeekList5;

        // 세션 저장 후 리다이렉트
        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect(`/guide/savesidebar/${userId}`);
        });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
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
router.put('/savesidebar/:userid', async(req,res)=>{
    try{
        let userId = req.params.userid;   //njh
        //let userId = req.body.userId;
        const month = req.session.month;
        const week = req.session.week;

        const IsWeekList1 = req.session.IsWeekList1;
        const IsWeekList2 = req.session.IsWeekList2;
        const IsWeekList3 = req.session.IsWeekList3;
        const IsWeekList4 = req.session.IsWeekList4;
        const IsWeekList5 = req.session.IsWeekList5;
        
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
        res.send('OK');
    }
    catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;