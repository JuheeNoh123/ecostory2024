const db = require('../util/database.js')

module.exports = class Health {
    constructor(name) {
        this.name = name;
    }

    // SELECT column-name : 데이터 조회에 사용됩니다. 
    static async find() {
        return await db.execute('SELECT * FROM health');
    }


};