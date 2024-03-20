const express = require('express');
var router = express.Router();


const reg_model = require('./models/reg_model');
const verify = require('./verify');
const jwt = require('jsonwebtoken');

const PRIVATEKEY = process.env.PRIVATEKEY;


router.post('/login', async (req, res) => {
    const { userid, password } = req.body;
    if (!userid || !password ) {
        return res.status(400).send({ message: 'id, password는 필수입력 사항입니다.' });
    }
    let user = new reg_model(userid, password);
    const checklogin = await user.login();
    console.log("[login.js > post > login]",user);
    
    if(checklogin){
        const token = jwt.sign({        
            userid: user.userid      
        }, PRIVATEKEY, {
            algorithm: 'ES256',
            expiresIn: '1h'      
        });
        
        //res.cookie('user', token);

        
        return res.send({ 
            message: '로그인 성공',
            token
            //vfy
        });
    }
    else{
        return res.status(400).send({ message: '로그인 실패' });
    }
    
    
})

router.post('/test', verify,async (req, res) => {
    return res.status(200).send({message:"인증 완료"})
})

module.exports = router;