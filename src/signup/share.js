const express = require('express');
var router = express.Router();

const user_model = require('./models/reg_model');
const post_model = require('./models/post_model');

router.get('/share/:userId/:postId', async(req, res)=>{
    const userId = req.params.userId;   //njh
    const postId = req.params.postId;   //njh
    const user = new user_model(userId);
    const user_Id = await user.findId(userId);  //12
    const username = await user.findName();
    const userImage = await user.findImage();
    const post = new post_model(user_Id.id);
    let content = await post.findByUserIdandPostId(postId);
    console.log(content[0][0])
    let responseJson = {
        id: content[0][0].id,
        image: content[0][0].image,
        content: content[0][0].content,
        username: username.name,  // 사용자 이름 추가
        userImage: userImage.userImage  // 사용자 이미지 추가
    };
    res.send(responseJson);


})

module.exports = router;