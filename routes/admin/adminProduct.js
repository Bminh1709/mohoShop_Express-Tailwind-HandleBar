var express = require('express');
var router = express.Router();
const model = require('../../models/adminModel'); 
// const requireAuth = require('../helpers/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

/* GET home page. */
// router.get('/', requireAuth, async (req, res) => {
router.get('/', async (req, res) => {
  const filter = req.query.filter;
  let products = {};
  try {
    const categories = await model.getCategories();
    const hotproducts = await model.getHotProducts();

    if (!filter || filter.length < 1) {
      products = await model.getProducts();
    } else {
      products = await model.getProductsWFilter(filter);
    }

    res.render('admin/adminProduct', {
      title: 'Sản phẩm',
      layout: 'manage',
      activeNav: 2,
      categories: categories,
      products: products,
      addAction: true,
      filter: filter,
      hotproducts: hotproducts
    });
  } catch (error) {
    console.log(error);
    res.redirect('/error');
  }
});

// image upload
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public/images/product');
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
  },
})
// const upload = multer({ storage: storage }).single("image");
const upload = multer({ storage: storage }).array('image');

router.post('/', upload, async (req, res) => {
  try {
    const { productname, category, discountprice, price, description, detaildescription } = req.body;
    const images = req.files.map(file => file.filename).join(',');
    const product = {
      productname: productname, 
      category: category,
      discountprice: discountprice,
      price: price,
      description: description,
      detaildescription: detaildescription,
      image: images
    };
    const checkAddProduct = await model.addProduct(product);
    res.redirect('/admin');
  } catch (error) {
    res.redirect('/error');
  }
});

router.get('/product/delete/:productid', async (req, res) => {
  try {
    const productid = req.params.productid;
    // First, retrieve the product to get the image filenames
    const product = await model.getProduct(productid);
    // Get image from db
    const imageFilenames = product.image.split(',');
    // Delete the product from the database
    const deleteProduct =  await model.deleteProduct(productid);
    // Now, delete every image
    for (const filename of imageFilenames) {
      const imagePath = path.join('./public/images/product', filename);
      console.log(imagePath);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image: ${err}`);
        } else {
          console.log(`Deleted image: ${filename}`);
        }
      });
    }

    res.redirect('/admin');
  } catch (error) {
    console.error(error);
      res.redirect('/error');
  }
});

router.get('/product/hot/:productid', async (req, res) => {
  try {
    const productId = req.params.productid;
    const productResult = await model.getHotProduct(productId);

    if (productResult) {
      await model.setHotProductFalse(productId);
    } else {
      await model.setHotProductTrue(productId);
    }
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
      res.redirect('/error');
  }
});

router.get('/product/update/:productid', async (req, res) => {
  try {
    const productId = req.params.productid;
    const product = await model.getProduct(productId);
    const categories = await model.getCategories();

    res.render('admin/adminProduct', {
      title: 'Sản phẩm',
      layout: 'manage',
      activeNav: 2,
      product: product,
      categories: categories,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/error');
  }
});

router.post('/product/update/:productid', upload, async (req, res) => {
  try {
    const productId = req.params.productid;
    const { productname, category, discountprice, price, description, detaildescription } = req.body;
    const images = req.files.map(file => file.filename).join(',');
    const product = {
      productid: productId,
      productname: productname, 
      category: category,
      discountprice: discountprice,
      price: price,
      description: description,
      detaildescription: detaildescription,
      image: images
    };
    console.log(product);
    if (images.length > 0) 
    {
      const productFound = await model.getProduct(productId);
      // Get image from db
      const imageFilenames = productFound.image.split(',');
      // Now, delete every image
      for (const filename of imageFilenames) {
        const imagePath = path.join('./public/images/product', filename);
        console.log(imagePath);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting image: ${err}`);
          } else {
            console.log(`Deleted image: ${filename}`);
          }
        });
      }
      const productResult = await model.updateProductWImg(product);
      res.redirect('/admin');
    }
    else
    {
      const productResult = await model.updateProduct(product);
      res.redirect('/admin');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/error');
  }

});

module.exports = router;