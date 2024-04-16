const fs = require('fs');
const jwt = require('jsonwebtoken');
//const PUBLICKEY = process.env.PUBLICKEY;
const publickey = fs.readFileSync('./bin/publicKey.key', 'utf8');
//const privateKey = fs.readFileSync('./bin/private_key.pem')
//const privateKey = fs.readFileSync('./bin/privateKey.key', 'utf8');
function authenticateToken(req, res, next) {
    // 요청 헤더에서 'Authorization' 값을 가져옵니다.
    const authHeader = req.headers['authorization'];
    
    // Bearer 토큰이므로 Bearer와 토큰을 분리합니다. 토큰이 없다면 undefined가 됩니다.
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      // 토큰이 없으면 401 Unauthorized 응답을 보냅니다.
      return res.sendStatus(401);
    }
  
    jwt.verify(token, publickey, { algorithms: 'RS256' }, (err, user) => {
      if (err) {
        // 토큰이 유효하지 않으면 403 Forbidden 응답을 보냅니다.
        return res.sendStatus(403);
      }
  
      // 토큰이 유효하면 user 정보를 req.user에 추가하고 다음 미들웨어로 진행합니다.
      req.user = user;
      next();
    });
  }

module.exports = authenticateToken;