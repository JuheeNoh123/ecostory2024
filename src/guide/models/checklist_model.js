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
            console.log("db save");
            //만약에 해당 user의 db에 이미 동일한 date가 있으면 그거 바꿔주고 없으면 save
            let Isdate = await db.execute('select date from checklist where date = ? and weeknumber = ?', [this.date, this.WeekNumber]);
            console.log(Isdate[0][0]);
            if(Isdate[0][0]){
                return await db.execute(`UPDATE checklist SET WeekListID1=?, WeekListID2=?,WeekListID3=?,WeekListID4=?,WeekListID5=?
                WHERE date = ? and weeknumber = ?`,
                [this.WeekListID1,this.WeekListID2,this.WeekListID3,this.WeekListID4,this.WeekListID5, this.date, this.WeekNumber]
                )
            }
            else{
                return await db.execute(
                    `Insert Into CheckList 
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
        catch{
            return false;
        }
    }

}