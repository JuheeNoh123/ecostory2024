const db = require('../../../util/database.js')

module.exports = class Eco_data{
    constructor(sigun_NM){
        this.sigun_NM = sigun_NM;
    }

    async sigun(){
        //console.log(this.sigun_NM);
        //let sigun = await db.execute('SELECT sigun_NM,Position_x, Position_y FROM sigun where sigun.sigun_NM = ?',[this.sigun_NM]);
        let sigun = await db.execute(`SELECT sigun_NM,Position_x, Position_y, circle, 
                    Emission_Score, Waste_Score, Air_Score, Total_Score, Severity FROM sigun 
                    LEFT JOIN eco_data ON sigun.id = eco_data.sigun_id`);
        console.log(sigun[0]);
        return sigun[0];
    }


}