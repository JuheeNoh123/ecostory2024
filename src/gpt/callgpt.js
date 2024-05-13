const express = require('express');
var router = express.Router();
const { callChatGPT } = require('./chatgpt');
const category_model = require('./models/category_model');
const guide_model = require('./models/guide_model');

function makeCategory(category_data){
    try{
        b=JSON.parse(category_data);
        //console.log(b);
        c=Object.keys(b);   //'친환경을 위한 요소'
        c.forEach(element => { 
            Object.keys(b[element]).forEach(async e=>{
                console.log("e : ",e);
                let category= new category_model(e);
                let category_Id = await category.find();
                if(category_Id) {
                    
                }
                else {
                    category_Id = await category.save();
                    category_Id = category_Id[0]['insertId'];
                    console.log("category_Id : ",category_Id);
                }
                b[element][e].forEach(async child=>{
                    let guide= new guide_model(child,category_Id );
                    await guide.save();
                    console.log("e, child : ",e, child);
                    
                })
                
            })
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
        console.log("모든 가이드가 성공적으로 저장됨", results);

        result = response[category_NM];
        return result;

    }
    catch(error){
        console.error('에러 : ', error);
        return null;
    }
}

function findIndexByGuideId(array, guideId) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].guide_Id == guideId) {
        return i; // "guide_Id"가 "1"인 요소의 인덱스 반환
      }
    }
    return -1; // "guide_Id"가 "1"인 요소가 없는 경우 -1 반환
  }


router.post('/ask', async (req, res)=>{
    const prompt = req.body.prompt;
    const response = await callChatGPT(prompt);
    if(response){
        category_data = makeCategory(response["content"]);
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
    guidelist_view = await guide.findwithcategoryId();
    console.log(guidelist_view[0]);
    let startIndex = findIndexByGuideId(guidelist_view[0], end_guide_Id)+1;
    console.log(startIndex);
    for(let i=0;i<10;i++){
        if(guidelist_view[0][startIndex]==undefined)break
        const guide_Id = guidelist_view[0][startIndex].guide_Id;
        const guide_NM = guidelist_view[0][startIndex].guide_NM;
        console.log(guide_Id,guide_NM);
        
        let viewJson = {
            "guide_Id" : guide_Id,
            "guide_NM" : guide_NM
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
        if (!response) {
            return res.status(500).json({'error': 'Failed to get response from ChatGPT API'});
        }

        const addedGuides = await addlist(response["content"], category_NM);
        res.json(addedGuides);
    } catch (error) {
        console.error('에러 : ', error);
        res.status(500).json({'error': 'An error occurred while processing the request.'});
    }
});



module.exports = router;