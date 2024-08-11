const db = require('../../../util/database.js')
const bcrypt = require('bcrypt');

module.exports = class User {
    constructor(userId,image,content) {
        this.userId = userId;
        this.image = image;
        this.content = content;
    }

    async save(){
        try{
            
            return await db.execute(`Insert Into post (image, content, userId) values (?,?,?)`,
                [this.image, this.content, this.userId]);
            
        }
        catch(err){
            console.error('Error during save:', err);
            return false;
        }
    }

    //마이페이지 메인 화면에 띄울 이미지
    async findall(){
        try{
            return await db.execute(`select id,image,content from post where userId = ?`,
                [this.userId]);
            
        }
        catch(err){
            console.error('Error during findall:', err);
            return false;
        }
    }

    async findByUserIdandPostId(postId){
        try{
            return await db.execute(`select id,image,content from post where userId = ? and id = ?`,
                [this.userId, postId]);
            
        }
        catch(err){
            console.error('Error during findByUserIdandPostId:', err);
            return false;
        }
    }

    async update(id){
        try{
            return await db.execute(`update post set image=?, content=? where id=? and userId = ?`,
                [this.image, this.content, id, this.userId]);
        }
        catch(err){
            console.error('Error during update:', err);
            return false;
        }
    }

    async delete(id){
        try{
            return await db.execute(`delete from post where id=? and userId = ?`,
                [ id, this.userId]);
        }
        catch(err){
            console.error('Error during update:', err);
            return false;
        }
    }
}