var express = require('express');
var router = express.Router();
const model = require('../models/productModel'); 

/* GET home page. */
router.get('/', async function(req, res) {
  try {
    const hotproducts = await model.getHotProducts();
    const btts = await model.getBtts();
    const kus = await model.getKus();
    res.render('index', { 
      title: 'Trang chủ',
      hotproducts: hotproducts,
      btts: btts,
      kus: kus
    });
  } catch (error) {
    res.redirect('/error');
  }
});

module.exports = router;
