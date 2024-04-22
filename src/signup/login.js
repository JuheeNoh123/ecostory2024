const express = require('express');
var router = express.Router();
const fs = require('fs');


const reg_model = require('./models/reg_model');
const verify = require('./verify');
const jwt = require('jsonwebtoken');
//const PRIVATEKEY = process.env.PRIVATEKEY;
const privateKey = fs.readFileSync('./bin/privateKey.key', 'utf8');
//const privateKey = fs.readFileSync('./bin/private_key.pem')
router.post('/login', async (req, res) => {
    const { userid, password } = req.body;
    if (!userid || !password ) {
        return res.status(400).send({ message: 'id, password는 필수입력 사항입니다.' });
    }
    let user = new reg_model(userid, password);
    const checklogin = await user.login();
    console.log("[login.js > post > login]",user);
    console.log(privateKey);
    if(checklogin){
        const token = jwt.sign({        
            userid: user.userid      
        }, privateKey, {
            algorithm: 'RS256',
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