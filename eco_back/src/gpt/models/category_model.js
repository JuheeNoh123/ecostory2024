const db = require('../../../util/database.js')

module.exports = class Category{
    constructor(category) {
        this.category = category;
    }

    async save() {
    // INSERT INTO table-name : 지정 column-name 순 번으로, row-data를 생성합니다. 
        try{
            return await db.execute(
                'INSERT INTO category (category_NM) VALUES (?)',
                [this.category]
            );
        }    
        catch{
            return false;
        }
    
    }


    // SELECT column-name : 데이터 조회에 사용됩니다. 
    async find() {
        try{
            let category_Id = await db.execute('SELECT category_Id FROM category where category.category_NM = ?', [this.category]);
            return category_Id[0][0];
        }
        catch {
            return false;
        }
    }

    async findAll(){
        try{
            let category_NM = await db.execute('SELECT category_Id,category_NM FROM category');
            return category_NM;
        }
        catch {
            return false;
        }
    }
}