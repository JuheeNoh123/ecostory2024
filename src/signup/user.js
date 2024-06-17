const express = require('express');
var router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const user_model = require('./models/reg_model');
const post_model = require('./models/post_model');
const publickey = fs.readFileSync('./bin/publicKey.key', 'utf8');
//토큰 확인
async function checktoken(authHeader){
    let User = {"userid": ""};
    
    // Bearer 토큰이므로 Bearer와 토큰을 분리합니다. 토큰이 없다면 undefined가 됩니다.
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // 토큰이 없으면 401 Unauthorized 응답을 보냅니다.
        console.log("토큰X");
        return false;
    }
    jwt.verify(token, publickey, { algorithms: 'RS256' }, (err, user) => {
        if (err) {
            // 토큰이 유효하지 않으면 403 Forbidden 응답을 보냅니다.
            console.log("토큰 유효 X");
            return false;
        }
        console.log(user);
        User = user
    });
    return User;
}


//마이페이지 - 메인창
router.get('/mypage/:userid', async(req, res) => {
    
    const authHeader = req.headers['authorization'];
    var IsLogIn = await checktoken(authHeader);
    const userId = req.params.userid;   //njh

    console.log(IsLogIn);
    if (IsLogIn.userid != userId){
        res.redirect(`/user/${userId}/share`);
    }
    else{
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
    
    
    

    
});

//게시글 작성하기
router.post('/mypage/:userid/post', async(req, res)=>{
    const authHeader = req.headers['authorization'];
    var IsLogIn = await checktoken(authHeader);
    const userId = req.params.userid;   //njh
    if(IsLogIn.userid != userId){
        res.sendStatus(403);
    }
    
    const post_Image = req.body.post_Image;
    const content = req.body.content;
    const user = new user_model(userId);
    const user_Id = await user.findId(userId);  //12
    //console.log(user_Id);
    const post = new post_model(user_Id.id, post_Image, content);
    await post.save();

    res.send("OK");
})

//게시글 수정하기
router.put('/mypage/:userid/update', async(req, res)=>{
    const authHeader = req.headers['authorization'];
    var IsLogIn = await checktoken(authHeader);
    const userId = req.params.userid;   //njh
    if(IsLogIn.userid != userId){
        res.sendStatus(403);
    }
    
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
    const authHeader = req.headers['authorization'];
    var IsLogIn = await checktoken(authHeader);
    const userId = req.params.userid;   //njh
    if(IsLogIn.userid != userId){
        res.sendStatus(403);
    }
    
    const post_Id = req.body.post_Id;
    const user = new user_model(userId);
    const user_Id = await user.findId(userId);  //12
    //console.log(user_Id);
    const post = new post_model(user_Id.id);
    await post.delete(post_Id);

    res.send("OK");
})

router.get('/:userid/share', async(req, res)=>{
    const userId = req.params.userid;   //njh
    const user = new user_model(userId);
    const user_name = await user.findName();
    const user_Id = await user.findId(userId);  //{ id: 12 }
    const user_image = await user.findImage();
    const post = new post_model(user_Id.id);
    const posts = await post.findall();
    //console.log(posts);
    returnJson = {};
    returnJson.Isshare = "비회원 전용 페이지"
    returnJson.user_name = user_name.name;
    returnJson.user_image = user_image.userImage;
    if (posts[0][0] != null){
        returnJson.post = posts[0];
    }
    else{
        returnJson.post = [];
    }
    res.send(returnJson);
})

module.exports = router;