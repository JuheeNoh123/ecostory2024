const db = require('../../../util/database.js')



module.exports = class User {
    constructor(userid, pw, name) {
        this.userid = userid;
        this.pw = pw;
        this.name = name;
    }

    async save() {
    // INSERT INTO table-name : 지정 column-name 순 번으로, row-data를 생성합니다. 
        return await db.execute(
            'INSERT INTO user (userid, pw, name) VALUES (?, password(?), ?)',
            [this.userid, this.pw, this.name]
        );
    }


    // SELECT column-name : 데이터 조회에 사용됩니다. 
    async find() {
        let user = await db.execute('SELECT userid FROM USER where user.userid = ?', [this.userid]);
        return user[0][0];
    }

    async login() {
        let user = await db.execute('SELECT userid,name FROM USER where user.userid = ? and pw = password(?) ', [this.userid,this.pw]);
        user = user[0][0];
        console.log("[reg_model > login ] ",user);
        if(user){
            this.name = user.name;
            return true;
        }
        else{
            return false;
        }
    }

    async findId(){
        let userId = await db.execute('select id from user where userId = ?', [this.userid]);
        return userId;
    }
};