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


router.get('/ask', async function(req,res){
    res.render('askgpt', {
        pass:true
    });
});


router.post('/ask', async (req,res)=>{
    const prompt = req.body.prompt;

    const response = await callChatGPT(prompt);
    
    if(response){
        category_data = makeCategory(response["content"]);
        res.json({'response':category_data})

    }
    else{
        res.status(500).json({'error':'Failed to get response from ChatGPT API'});
    }

    
})




module.exports = router;