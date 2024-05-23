const express = require('express');
var router = express.Router();
const { callChatGPT } = require('./chatgpt');
const category_model = require('./models/category_model');
const guide_model = require('./models/guide_model');

async function makeCategory(category_data){
    try{
        data=JSON.parse(category_data);
        //console.log("data", data);
        category=Object.keys(data);   
        //console.log("category:",category)
        category.forEach( async element =>{ 
            console.log("element", element)
            let category= new category_model(element);
            let category_Id = await category.find();
            
            if(category_Id==undefined) {
                category_Id = await category.save();
                category_Id = category_Id[0]['insertId'];
                console.log("카테고리 save 완료 : ", category_Id);
                data[element].forEach(async e=>{
                    console.log("e, category_Id",e,category_Id )
                    let guide= new guide_model(e,category_Id);
                    console.log(guide);
                    await guide.save();
    
                })
            }
            else{
                data[element].forEach(async e=>{
                    console.log("e, category_Id",e,category_Id['category_Id'] )
                    let guide= new guide_model(e,category_Id['category_Id']);
                    console.log(guide);
                    await guide.save();
    
                })
            }
            
        });

    }
    catch(error){
        console.error('에러 : ', error);
        return null;
    }
}

async function addlist(add_data, category_NM){
    try{
        let category= new category_model(category_NM);
        let category_Id = await category.find();
        const response=JSON.parse(add_data);
        console.log("response : ", response);
        const title=Object.keys(response); //생활
        console.log("title : ", title);
        let promises = []; // 가이드 저장을 위한 프로미스 배열
        
        for (let element of title) {
            console.log("element : ", element);
            for (let value of response[element]) {
                const guide = new guide_model(value, category_Id['category_Id']);
                await guide.save();
                console.log("value : ",value);
                promises.push(value);
            }
        }

        // 모든 가이드가 성공적으로 저장될 때까지 기다림
        await Promise.all(promises);
        console.log("모든 가이드가 성공적으로 저장됨", promises);

        result = response[category_NM];
        return result;

    }
    catch(error){
        console.error('에러 : ', error);
        return null;
    }
}

function findIndexByGuideId(array, guideId) {
    console.log(array.length);
    for (let i = 0; i < array.length; i++) {
      if (array[i].guide_Id == guideId) {
        console.log(array[i].guide_Id , i);
        if(i==0) return i;
        return i+1; // "guide_Id"가 "1"인 요소의 인덱스 반환
      }
    }
    return -1; // "guide_Id"가 "1"인 요소가 없는 경우 -1 반환
}


router.post('/ask', async (req, res)=>{
    const prompt = req.body.prompt;
    const response = await callChatGPT(prompt);
    // const response = {
    //     role: 'assistant',
    //     content: '{\n \
    //           "가정": [\
    //               "플라스틱 사용 줄이기",\
    //               "재활용 가능한 제품 구매하기", \
    //               "에너지 효율적인 전구로 교체하기",\
    //               "급수기 대신 물병이나 잔을 사용하기",\
    //               "가정의 전력 소비를 줄이기",\
    //               "친환경 세제 사용하기",\
    //               "음식물 쓰레기를 재활용하기",\
    //               "가정에서 나무 화덕으로 난방하기",\
    //               "가정에서 쓰는 물을 절약하기",\
    //               "자체적으로 재생 가능한 에너지 사용하기"\
    //           ],\
    //           "일상": [\
    //               "대중교통을 이용하기",\
    //               "오토바이나 자전거를 이용하기",\
    //               "도시림에 나무 심기",\
    //               "자원순환을 생각하며 쇼핑하기",\
    //               "종이를 많이 사용하는 것을 줄이기",\
    //               "네모지기를 줄이는 것이 환경에 좋음",\
    //               "수도꼭지에 물을 닦기",\
    //               "농약을 사용하지 않는 유기농 농산물 구입하기",\
    //               "공공장소에 있는 쓰레기통을 이용하여 쓰레기를 버리기",\
    //               "친환경 제품을 구입하기"\
    //           ],\
    //           "사회": [\
    //               "친환경 단체에 가입하여 활동하기",\
    //               "지역 및 봉사 활동에 참여하기",\
    //               "동물 보호 시설에서 봉사하기",\
    //               "친환경 운동에 동참하기",\
    //               "친환경 교육과 캠페인 활동에 참여하기",\
    //               "지역 커뮤니티 활동에 참여하기",\
    //               "환경을 주제로 한 문화 활동에 참여하기",\
    //               "친환경 제품을 지원하는 기부하기",\
    //               "친환경 활동을 홍보하기",\
    //               "지구를 위해 무엇이든 할 것을 결심하기"\
    //           ]\
    //       }'
    //   }
    if(response){
        category_data = await makeCategory(response["content"]);
        res.send("db 저장완료");
    }
    else{
        res.status(500).json({'error':'Failed to get response from ChatGPT API'});
    }
})

//카테고리 리스트 출력 라우터
router.get('/viewmain', async(req,res)=>{
    const category = new category_model();
    
    const category_data = await category.findAll();
    let guide_Idx=0;
    for (let i=0;i<category_data[0].length;i++){
        let guide= new guide_model('',category_data[0][i].category_Id);
        let guidelist_view = await guide.findwithcategoryId();
        let guideNM_list = []
        for (let j=0;j<10;j++){
            guide_Idx = guidelist_view[j].guide_Id;
            let guide_NM = await guide.findwithguideId(guide_Idx);
            guideNM_list.push({
                guide_Id:guide_Idx,
                guide_NM:guide_NM[0][0].guide_NM
            })
        }
        category_data[0][i].guide_NM = guideNM_list;
        
        
    }
    
    
    res.send(category_data[0]);
})

//10개씩 끊어서 보여주는 라우터
router.get('/view', async(req, res)=>{
    /*
    {
	"end_guide_Id":0,
	"category_Id":15
    }
    */
    const end_guide_Id = req.body.end_guide_Id;
    const category_Id = req.body.category_Id;
    let viewList = [];
    let guide= new guide_model('',category_Id);
    let guidelist_view = await guide.findwithcategoryId();
    
    console.log(guidelist_view);
    let startIndex = findIndexByGuideId(guidelist_view, end_guide_Id);
    console.log(startIndex);
    for(let i=0;i<10;i++){
        if(guidelist_view[startIndex]==undefined)break
        const guide_Id = guidelist_view[startIndex].guide_Id;
        const guide_NM = await guide.findwithguideId(guide_Id);
        console.log(guide_Id,guide_NM[0][0]['guide_NM']);
        
        let viewJson = {
            "guide_Id" : guide_Id,
            "guide_NM" : guide_NM[0][0]['guide_NM']
        };

        viewList.push(viewJson);
        startIndex++;
    }
    res.send(viewList);
})
/*
router.post('/askmore', async (req, res)=>{
    
    const prompt = req.body.prompt;
    const response = await callChatGPT(prompt);
    const category_NM = req.body.category_NM;
    if(response){
        console.log(response["content"]);
        add_data = await addlist(response["content"], category_NM);
        var data = [];
        for (let i = 0; i < add_data.length; i++) {
            let guide = new guide_model();
            let guide_Id_list = await guide.findwithguide_NM(add_data[i]);
            console.log("guide_Id_list", guide_Id_list);
            if (!Array.isArray(guide_Id_list) || guide_Id_list.length === 0 || !Array.isArray(guide_Id_list[0]) || guide_Id_list[0].length === 0 || !guide_Id_list[0][0].guide_Id) {
                console.error("guide_Id를 찾을 수 없습니다.");
                continue; // 다음 반복으로 넘어감
            }
        
            let guide_Id = guide_Id_list[0][0].guide_Id;
            var jsonObject = {
                'guide_Id': guide_Id,
                'guide_NM': add_data[i]
            };
            data.push(jsonObject);
        }
        
        res.json(data);
        
    }
    else{
        res.status(500).json({'error':'Failed to get response from ChatGPT API'});
    }
    
})
*/
router.post('/askmore', async (req, res) => {
    const prompt = req.body.prompt;
    const category_NM = req.body.category_NM;
    
    try {
        const response = await callChatGPT(prompt);
        const addedGuides = await addlist(response["content"], category_NM);
        res.json(addedGuides);
    } catch (error) {
        console.error('에러 : ', error);
        res.status(500).json({'error': 'An error occurred while processing the request.'});
    }
});



module.exports = router;