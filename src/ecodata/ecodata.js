const express = require('express');
var router = express.Router();

const data_model = require('./models/data_model');

router.get('/ecodata', async(req, res) => {
    //const sigun_NM = req.body.sigun_NM;
    //console.log(sigun_NM);
    //let eco_data = new data_model(sigun_NM);
    let eco_data = new data_model();
    let sigun = await eco_data.sigun();
    
    return res.status(200).send(sigun);
});
module.exports = router;