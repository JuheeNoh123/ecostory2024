const db = require('../../../util/database.js')

module.exports = class Guide{
    constructor(guide,category_Id) {
        this.category_Id = category_Id;
        this.guide = guide;
    }

    async save() {
    // INSERT INTO table-name : 지정 column-name 순 번으로, row-data를 생성합니다. 
    
    try{
        console.log(this.category_Id,this.guide);
        return await db.execute(
            'INSERT INTO guide (category_Id, guide_NM) VALUES (?,?)',
            [this.category_Id,this.guide]
        );

    }
    catch{
        return false;
    }

    }   
    
    async findAll(){
        try{
            return await db.execute('select guide.category_Id, category_NM, guide_Id, guide_NM from guide left JOIN category ON category.category_Id = guide.category_Id');
        }
        catch{
            return false;
        }
    }
    
    async findwithcategoryId(){
        try{
            //console.log(this.category_Id);
            let guide_NM = await db.execute('SELECT guide_Id, guide_NM FROM guide where guide.category_Id = ?', [this.category_Id]);
            return guide_NM;
        }
        catch{
            return false;
        }
    }

    async findwithguideId(guide_Id){
        try{
            //console.log(this.category_Id);
            let guide_NM = await db.execute('SELECT guide_NM FROM guide where guide.guide_Id = ?', [guide_Id]);
            return guide_NM;
        }
        catch{
            return false;
        }
    }

    async findwithguide_NM(guide_NM){
        try{
            let guide_Id = await db.execute('SELECT guide_Id from guide where guide.guide_NM = ?',[guide_NM]);
            return guide_Id;
        }
        catch{
            return false;
        }
    }

}