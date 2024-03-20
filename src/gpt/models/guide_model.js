const db = require('../../../util/database.js')

module.exports = class Guide{
    constructor(guide,category_Id) {
        this.category_Id = category_Id;
        this.guide = guide;
    }

    async save() {
    // INSERT INTO table-name : 지정 column-name 순 번으로, row-data를 생성합니다. 
    try{
        return await db.execute(
            'INSERT INTO guide (category_Id, guide_NM) VALUES (?,?)',
            [this.category_Id,this.guide]
        );
    }
    catch{
        return false;
    }
    }    
    

}