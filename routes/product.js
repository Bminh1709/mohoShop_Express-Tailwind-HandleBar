var express = require('express');
var router = express.Router();
const model = require('../models/productModel'); 

/* GET home page. */
router.get('/', async function(req, res) {
  const filter = req.query.filter;
  const categoryname = "Tất cả";
  try {
    const hotproducts = await model.getHotProducts();
    let products = {};
    if (!filter || filter.length < 1) {
      products = await model.getProducts();
    } else {
      products = await model.getProductsWFilter(filter);
    }
    res.render('user/product', { 
      title: 'Sản phẩm',
      layout: 'search',
      products: products,
      hotproducts: hotproducts,
      categoryname: categoryname,
      filter: filter,
      Message: req.session.message
    });
    if (req.session.message != null || req.session.message == undefined) {
      delete req.session.message;
    }
  } catch (error) {
    console.log(error);
    res.redirect('/error');
  }
});

router.get('/:categoryid', async function(req, res) {
  const categoryId = req.params.categoryid;
  try {
    const categoryname = await model.getCategoryname(categoryId);
    const products = await model.getProductsByCat(categoryId);
    const hotproducts = await model.getHotProducts();

    res.render('user/product', { 
      title: 'Sản phẩm',
      layout: 'search',
      products: products,
      hotproducts: hotproducts,
      categoryname: categoryname,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/error');
  }
});

router.get('/detail/:productid', async function(req, res) {
  const productId = req.params.productid;
  try {
    const product = await model.getProduct(productId);

    res.render('user/detail', { 
      title: 'Chi tiết sản phẩm',
      layout: 'search',
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/error');
  }
});

module.exports = router;
