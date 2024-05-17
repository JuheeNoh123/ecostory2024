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
        //this.guide = Buffer.from(this.guide).toString('utf8');
        //this.category_Id = Buffer.from(this.category_Id).toString('utf8');
        let save = await db.execute(
            'INSERT INTO guide (category_Id, guide_NM) VALUES (?,?) ON DUPLICATE KEY UPDATE guide_NM = VALUES(guide_NM)',
            [this.category_Id,this.guide]
        );
        console.log("가이드db저장 완료");
        return save
    }
    catch(error){
        console.error('가이드 저장 중 오류 발생:', error);
        throw error;
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
            let guide_Id = await db.execute('SELECT guide_Id FROM guide where guide.category_Id = ?', [this.category_Id]);
            return guide_Id[0];
        }
        catch{
            return false;
        }
    }

    async findwithguideId(guide_Id){
        try{
            //console.log("guide_model>> guide_Id : ",guide_Id);
            let guide_NM = await db.execute('SELECT guide_NM FROM guide where guide.guide_Id = ?', [guide_Id]);
            //console.log("guide_model>> guide_NM : ",guide_NM);
            return guide_NM;
        }
        catch{
            return false;
        }
    }

    async findwithguide_NM(guide_NM){
        try{
            let guide_Id = await db.execute('SELECT guide_Id from guide where guide.guide_NM = ?',[guide_NM]);
            console.log("guide_ID :", guide_Id);
            return guide_Id;
        }
        catch{
            return false;
        }
    }

}