const express = require('express');
var router = express.Router();
const guide_model = require('../gpt/models/guide_model');


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
        let new_Id = await guide.findwithguideId(idx);
        console.log(new_Id[0][0]);
        while(new_Id[0][0] == undefined || idx == delete_Id){
            idx = await randomInt(1, 224);
            new_Id = await guide.findwithguideId(idx);
            console.log(idx);
        }
        ans[i].guide_Id = new_Id[0][0];
        console.log(idx);
        console.log(ans);
    }
    
    const transformedData = ans.map(item => ({
        week: item.week,
        guide_Id: item.guide_Id.guide_NM
      }));

    res.send(transformedData); 
})

router.post('/save', async(req, res)=>{
/*
    {
	"userId" : "njh",
		"list" : [
		{
			"1": [
				{
					"1": "식사를 할 때 음식 남김을 최소화하기"
				},
				{
					"2": "지구 친화적 옷차림"
				},
				{
					"3": "깨끗한 연료를 사용하는 차량을 선택하기"
				},
				{
					"4": "식사 계획 세우기"
				},
				{
					"5": "자전거 나 걷기"
				}
			]
		},
		{
			"2": [
				{
					"1": "대중교통 이용"
				},
				{
					"2": "자전거 나 걷기"
				},
				{
					"3": "부동산 재활용 제품 구매"
				},
				{
					"4": "가정에서 야채와 과일을 자체 재배하기"
				},
				{
					"5": "지역 시장 이용"
				}
			]
		},
		...
	]
}
*/

})
module.exports = router;