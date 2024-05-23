const db = require('../../../util/database.js')

module.exports = class CheckList{
    constructor(UserId,date,WeekNumber,
        WeekListID1, IsWeekList1, 
        WeekListID2, IsWeekList2,
        WeekListID3,IsWeekList3,
        WeekListID4,IsWeekList4,
        WeekListID5,IsWeekList5) {
        this.UserId=UserId;
        this.date= date;
        this.WeekNumber=WeekNumber;
        this.WeekListID1=WeekListID1;
        this.IsWeekList1=IsWeekList1;
        this.WeekListID2=WeekListID2;
        this.IsWeekList2=IsWeekList2;
        this.WeekListID3=WeekListID3;
        this.IsWeekList3=IsWeekList3;
        this.WeekListID4=WeekListID4;
        this.IsWeekList4=IsWeekList4;
        this.WeekListID5=WeekListID5;
        this.IsWeekList5=IsWeekList5;
    }

    async save(){
        try{
            //만약에 해당 user의 db에 이미 동일한 date가 있으면 그거 바꿔주고 없으면 save
            let Isdate = await db.execute('select date from checklist where date = ? and WeekNumber = ? and UserID=?', [this.date, this.WeekNumber,this.UserId]);
            console.log(Isdate[0][0]);
            if(Isdate[0][0]){
                return await db.execute(`UPDATE checklist SET WeekListID1=?, WeekListID2=?,WeekListID3=?,WeekListID4=?,WeekListID5=?
                WHERE date = ? and WeekNumber = ?`,
                [this.WeekListID1,this.WeekListID2,this.WeekListID3,this.WeekListID4,this.WeekListID5, this.date, this.WeekNumber]
                )
            }
            else{
                console.log("db save");
                return await db.execute(
                    `Insert Into checklist 
                        (UserId,date,WeekNumber,
                        WeekListID1, IsWeekList1, 
                        WeekListID2, IsWeekList2,
                        WeekListID3,IsWeekList3,
                        WeekListID4,IsWeekList4,
                        WeekListID5,IsWeekList5)
                        values (?,?,?,?,?,?,?,?,?,?,?,?,?) `,
                    [this.UserId, this.date,this.WeekNumber,
                        this.WeekListID1,
                        this.IsWeekList1,
                        this.WeekListID2,
                        this.IsWeekList2,
                        this.WeekListID3,
                        this.IsWeekList3,
                        this.WeekListID4,
                        this.IsWeekList4,
                        this.WeekListID5,
                        this.IsWeekList5]
                );
            }
            
        }
        catch(err){
            console.error('Error during save:', err);
            return false;
        }
    }

    async change(userId, date, week, usalId, changeId){
        try{
            let IsID;
            for(let i=1;i<=5;i++){
                const query = `SELECT WeekListID${i} FROM checklist WHERE WeekListId${i} = ? and WeekNumber = ? and UserId=? and date = ?`;
                IsID = await db.execute(query,[usalId,week, userId,date]);
                console.log("IsID : ", IsID[0][0])
                if (IsID[0][0]) {
                    IsID = i;
                    console.log(IsID);
                    break;
                }
            }
            console.log(IsID);
            const query = `UPDATE checklist SET WeekListID${IsID}=? where WeekListId${IsID} = ? and date =? and UserId= ?`
            const params = [changeId, usalId,date, userId]
            const result = await db.execute(query, params);
            return result;
        }
        catch(err){
            console.error('Error during change:', err);
            return false;
        }
    }

    async find(){
        let query = `select WeekNumber, WeekListID1, WeekListID2, WeekListID3, WeekListID4, WeekListID5 
                    from checklist where date = ? and UserID=?;`
        let params = [this.date,this.UserId]
        let res = await db.execute(query, params);
        return res;
    }

    async sidebar(){
        try{
            let query = `SELECT c.WeekNumber, 
            c.WeekListID1, g1.guide_NM AS WeekListNM1, c.IsWeekList1,
            c.WeekListID2, g2.guide_NM AS WeekListNM2, c.IsWeekList2,
            c.WeekListID3, g3.guide_NM AS WeekListNM3, c.IsWeekList3,
            c.WeekListID4, g4.guide_NM AS WeekListNM4, c.IsWeekList4,
            c.WeekListID5, g5.guide_NM AS WeekListNM5, c.IsWeekList5
            FROM checklist c
            LEFT JOIN guide g1 ON c.WeekListID1 = g1.guide_Id
            LEFT JOIN guide g2 ON c.WeekListID2 = g2.guide_Id
            LEFT JOIN guide g3 ON c.WeekListID3 = g3.guide_Id
            LEFT JOIN guide g4 ON c.WeekListID4 = g4.guide_Id
            LEFT JOIN guide g5 ON c.WeekListID5 = g5.guide_Id 
            where userId = ? and date = ? and WeekNumber = ?
            `
            let params = [this.UserId, this.date, this.WeekNumber]
            let res = await db.execute(query, params);
            return res;
        }
        catch(err){
            console.error('error:', err);
            return false;
        }

    }
}