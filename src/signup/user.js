const express = require('express');
var router = express.Router();

const user_model = require('./models/reg_model');
const post_model = require('./models/post_model');


//마이페이지 - 메인창
router.get('/mypage/:userid', async(req, res) => {
    try{
        const userId = req.params.userid;   //njh
        const user = new user_model(userId);
        const user_name = await user.findName();
        const user_Id = await user.findId(userId);  //{ id: 12 }
        const user_image = await user.findImage();
        const post = new post_model(user_Id.id);
        const posts = await post.findall();
        //console.log(posts);
        returnJson = {};
        returnJson.Isshare = "회원 전용 페이지"
        returnJson.user_name = user_name.name;
        returnJson.user_image = user_image.userImage;
        if (posts[0][0] != null){
            returnJson.post = posts[0];
        }
        else{
            returnJson.post = [];
        }
        res.send(returnJson);
    }    
    catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.put('/profile/:userid/update', async(req, res) => {
    try{
        const userId = req.params.userid;   //njh
        const user = new user_model(userId);
        const userImage = req.body.userImage;
        const name = req.body.name;
        let result = await user.changeProfile(userImage, name);
        console.log(result);
        res.send("OK");
    }    
    catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

//게시글 작성하기
router.post('/mypage/:userid/post', async(req, res)=>{
    try{
        const userId = req.params.userid;   //njh
        const post_Image = req.body.post_Image;
        const content = req.body.content;
        const user = new user_model(userId);
        const user_Id = await user.findId(userId);  //12
        //console.log(user_Id);
        const post = new post_model(user_Id.id, post_Image, content);
        await post.save();
    }
    catch (error){
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }

    res.send("OK");
})

//게시글 수정하기
router.put('/mypage/:userid/update', async(req, res)=>{

    const userId = req.params.userid;   //njh
    const post_Id = req.body.post_Id;
    const post_Image = req.body.post_Image;
    const content = req.body.content;
    const user = new user_model(userId);
    const user_Id = await user.findId(userId);  //12
    //console.log(user_Id);
    const post = new post_model(user_Id.id, post_Image, content);
    await post.update(post_Id);

    res.send("OK");
})

//게시글 삭제하기
router.delete('/mypage/:userid/delete', async(req, res)=>{
    
    const userId = req.params.userid;   //njh
    const post_Id = req.body.post_Id;
    const user = new user_model(userId);
    const user_Id = await user.findId(userId);  //12
    //console.log(user_Id);
    const post = new post_model(user_Id.id);
    await post.delete(post_Id);

    res.send("OK");
})


module.exports = router;