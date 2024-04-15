const fs = require('fs');
const crypto = require('crypto');

// 키 파일로부터 키를 읽어옴
const privateKey = fs.readFileSync('./bin/private_key.pem', 'utf8');
const publicKey = fs.readFileSync('./bin/public_key.pem', 'utf8');

// 데이터 생성
const data = 'Hello, World!';

// 데이터 암호화
const encryptedData = crypto.publicEncrypt({
  key: publicKey,
  padding: crypto.constants.RSA_PKCS1_PADDING
}, Buffer.from(data, 'utf-8'));

console.log('Encrypted Data:', encryptedData.toString('base64'));

// 데이터 복호화
const decryptedData = crypto.privateDecrypt({
  key: privateKey,
  padding: crypto.constants.RSA_PKCS1_PADDING
}, encryptedData);

console.log('Decrypted Data:', decryptedData.toString('utf-8'));
