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
        //console.log(add_data);
        let category_Id = await category.find();
        console.log(category_Id['category_Id']);
        response=JSON.parse(add_data);
        title=Object.keys(response); //생활
        //console.log(title); //['친환경을 위한 요소']
        let result = [];
        
        title.forEach(async element => {
            response[element].forEach(async (value, index)=>{
                let guide= new guide_model(value, category_Id['category_Id']);
                let save = await guide.save();  
                console.log("db save : " , save);               
            })
            
        })
        console.log("response[category_NM]: \n",response[category_NM]);
        result = response[category_NM];
        return result;
    }
    catch(error){
        console.error('에러 : ', error);
        return null;
    }
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


router.get('/view', async(req, res)=>{
    let guide= new guide_model();
    guidelist_view = await guide.findAll();
    res.send(guidelist_view[0]);
})

router.post('/askmore', async (req, res)=>{
    
    const prompt = req.body.prompt;
    const response = await callChatGPT(prompt);
    const category_NM = req.body.category_NM;
    if(response){
        console.log(response["content"]);
        add_data = await addlist(response["content"], category_NM);
        //add_data = await addlist(response, category_NM);
        console.log("add_data : \n",add_data);
        res.json({"data":add_data});
        //res.send("db 저장 완료?");
    }
    else{
        res.status(500).json({'error':'Failed to get response from ChatGPT API'});
    }
    
})
module.exports = router;