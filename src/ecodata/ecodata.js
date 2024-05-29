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

router.get('/testcors', (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.send('CORS headers set');
  });
module.exports = router;