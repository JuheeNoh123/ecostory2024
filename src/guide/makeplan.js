const express = require('express');
var router = express.Router();
const guide_model = require('../gpt/models/guide_model');
const category_model = require('../gpt/models/category_model');
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
// async function makeextra(category_cnt,category_Id){
    
//     for(let i=0;i<category_cnt;i++){
//         let guide = new guide_model('', category_Id[i]); 
//         const extra_guide = await guide.find();
//         const pr_extra_guide = extra_guide[0];
//         //가이드 리스트들을 라우터로 어떻게 보내지..?
//         pr_extra_guide
//     }
// }

async function randomInt(min, max){ 
    console.log("min: ", min);
    console.log("max: ", max);
    var randomNum = Math.floor(Math.random()*(max-min+1)) + min; 
    return randomNum;
}

router.post('/makeplan', async(req,res)=>{
    const guide_list = req.body.checklist.guide_Id;
    const listcnt= guide_list.length;
    const category_Id = req.body.checklist.category_Id;
    const category_cnt = category_Id.length;
    const final_list = [];
    const sum = [];

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
            for(let i=0; i<sum.length;i++){
                if(cnt<(25-listcnt)){
                    const idx1 = await randomInt(0, category_cnt-1);
                    const idx2 = await randomInt(0, sum[i].length-1);
                    console.log(idx1, idx2);
                    cnt++;

                    final_list.push(sum[idx1][idx2]);
                }
                else{break;}
            }
            //console.log("final_list",final_list);
        }
        

    }

    //final_list.push()
    console.log(final_list);

    // 변환된 결과를 담을 배열
    let transformedData = [];

    // 요구 사항에 따라 데이터를 그룹화
    const groups = {};

    const groupedByFive = [];
    let count = 1;

    for (let i = 0; i < final_list.length; i += 5) {
        const group = {};
        group[count++] = final_list.slice(i, i + 5).map((item, index) => ({[`${index + 1}`]: item.guide_NM}));
        groupedByFive.push(group);
    }
    
    transformedData = JSON.stringify(groupedByFive);
    res.send(transformedData);
    
})
module.exports = router;