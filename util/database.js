const mysql = require('mysql2');

require('dotenv').config();
const { HOST,USER,DATABASE,PASSWORD } = process.env;

// 이외에도 createConnection을 통해서도 연결이 가능하다고 합니다.
// createPool과의 차이는 단일 연결이냐, 복수 연결이냐의 차이입니다.

// 단일 연결의 경우 하나가 연결되면, 다른 유저는 연결이 불가능합니다. 유저마다 연결하고 끊고 연결하기를 반복하기 때문에 시간과 비용이 많이 소요됩니다.
// 복합 연결은 연결 제한 수를 정할 수 있습니다. 너무나 많은 연결은 서버 메모리를 크게 소모하기 때문에 조심하는 게 좋다고 합니다. 


const pool = mysql.createPool({
    host: HOST,
    port: "3306",
    user: USER,
    database: DATABASE,
    password: PASSWORD,
});
/*
const pool = mysql.createPool({
    host: "localhost", 
    port: "3306",
    user: "eco_user", 
    database: "ecostory_db", 
    password: "1234"
});*/

module.exports = pool.promise();

