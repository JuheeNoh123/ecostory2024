const db = require('../../../util/database.js')
const bcrypt = require('bcrypt');


module.exports = class User {
    constructor(userid, pw, name) {
        this.userid = userid;
        this.pw = pw;
        this.name = name;
    }

    async save() {
	    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(this.pw, 10); // 두 번째 매개변수는 salt의 자릿

    // INSERT INTO table-name : 지정 column-name 순 번으로, row-data를 생성합니다. 
	    return await db.execute(
            'INSERT INTO user (userid, pw, name) VALUES (?, ?, ?)',
            [this.userid, hashedPassword, this.name]
        );
    }


    // SELECT column-name : 데이터 조회에 사용됩니다. 
    async find() {
        let user = await db.execute('SELECT userid FROM user where user.userid = ?', [this.userid]);
        return user[0][0];
    }

    async findName(){
        let name = await db.execute('SELECT name FROM user where user.userid = ?',[this.userid]);
        return name[0][0];
    }

    async findImage(){
        let name = await db.execute('SELECT userImage FROM user where user.userid = ?',[this.userid]);
        return name[0][0];
    }


    async login() {
	 // 사용자가 제공한 비밀번호
        const userProvidedPassword = this.pw;
        console.log("userProvidedPassword > ",userProvidedPassword);
        // 데이터베이스에서 사용자의 해시된 비밀번호 가져오기
        const [userData] = await db.execute('SELECT userid, pw, name FROM user WHERE userid = ?', [this.userid]);
        const storedHashedPassword = userData[0].pw;
        console.log("storedHashedPassword > ",storedHashedPassword);
        // bcrypt.compare() 함수를 사용하여 비밀번호 비교
        const isMatch = await bcrypt.compare(userProvidedPassword, storedHashedPassword);

        if (isMatch) {
            // 비밀번호가 일치함
            this.name = userData[0].name;
            return true;
        } else {
            // 비밀번호가 일치하지 않음
            return false;
        }
    }

    async findId(){
        let userId = await db.execute('select id from user where userId = ?', [this.userid]);
        return userId[0][0];
    }
};
