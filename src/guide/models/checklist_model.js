const db = require('../../../util/database.js')

module.exports = class CheckList{
    constructor(UserId,WeekNumber,
        WeekListID1, IsWeekList1, 
        WeekListID2, IsWeekList2,
        WeekListID3,IsWeekList3,
        WeekListID4,IsWeekList4,
        WeekListID5,IsWeekList5) {
        this.UserId=UserId;
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
            return await db.execute(
                `Insert Into CheckList 
                    (UserId,WeekNumber,
                    WeekListID1, IsWeekList1, 
                    WeekListID2, IsWeekList2,
                    WeekListID3,IsWeekList3,
                    WeekListID4,IsWeekList4,
                    WeekListID5,IsWeekList5)
                    values (?,?,?,?,?,?,?,?,?,?,?,?) `,
                [this.UserId, this.WeekNumber,
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
        catch{
            return false;
        }
    }
}