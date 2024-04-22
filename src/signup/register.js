const express = require('express');
var router = express.Router();
// 사용자 정보를 담을 배열


const reg_model = require('./models/reg_model');

router.post('/signup', async (req, res) => {

    const { userid, password, name, checkpw } = req.body;
    //id, password, name이 있는지 체크한다.
    if (!userid || !password || !name || !checkpw ) {
      return res.status(400).send({ message: 'id, password, name은 필수입력 사항입니다.' });
    }
  
    let user = new reg_model(userid, password, name);

    console.log(user.find);

    // id는 중복되지 않도록한다.
    const checkuser = await user.find();
    console.log(checkuser);
    if (checkuser) {
      return res.status(400).send({ message: '이미 존재하는 아이디입니다.' });
    }

    if(password != checkpw){
      return res.status(400).send({ message: '비밀번호를 확인해주세용' });
    }
  
    // TODO 사용자를 추가한다.
    //users.push(req.body);
    await user.save();
    return res.send({ message: '사용자를 등록했습니다.' });
  
})
  

//id 중복 확인
router.post('/checkid', async (req, res) => {
  const { userid} = req.body;
  if (!userid) {
    return res.status(400).send({ message: 'id는 필수입력 사항입니다.' });
  }
  let user = new reg_model(userid)
  const checkuser = await user.find();
  console.log(checkuser);
  if (checkuser) {
    return res.status(400).send({ message: '이미 존재하는 아이디입니다.' });
  }
  else{
    return res.status(200).send({ message: 'success' });
  }
})
  

module.exports = router;