var express = require('express');
var router = express.Router();
const model = require('../models/userModel'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');

/* GET users listing. */
router.get('/profile', async function(req, res) {
  const userId = 1;
  try {
    const user = await model.getUser(userId);
    const favorites = await model.getFavorites(userId);
    const orders = await model.getOrders(userId);

    res.render('user/profile', { 
        title: 'Trang cá nhân',
        user: user,
        favorites: favorites,
        orders: orders
    });
  } catch (error) {
    res.redirect('error');
  }
});

router.post('/profile', async function(req, res) {
  const userId = 1;
  const { phone, password, fullname, address } = req.body;
  try {
    const user = {
      phone: phone,
      password: password,
      fullname: fullname,
      address: address
    }
    const updateUser = model.updateUser(user, userId);
    res.redirect('/user/profile');
  } catch (error) {
    res.redirect('/error');
  }
});

router.get('/favorite/:productid', async function(req, res) {
  const productId = req.params.productid;
  const userId = 1;
  let message = '';
  try {
    const resultFavoriteFound = await model.getFavorite(userId, productId);

    if (!resultFavoriteFound) {
      const resultAddFavorite = await model.addFavorite(userId, productId);
      message = "Thêm sản phẩm vào mục yêu thích thành công";
    }
    else {
      message = "Sản phẩm đã tồn tại trong mục yêu thích của bạn";
    }
    req.session.message = message;
    res.redirect('/product');
  } catch (error) {
    console.error(error);
    res.redirect('/error');
  }
});

router.get('/favorite/delete/:favoriteid', async function(req, res) {
  const favoriteId = req.params.favoriteid;
  try {
    const resultDeleteFavorite = await model.deleteFavorite(favoriteId);
    res.redirect('/user/profile');
  } catch (error) {
    console.error(error);
    res.redirect('/error');
  }
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images/user');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/profile/image', upload.single('image'), async function(req, res) {
  try {
    const userId = 1; // Replace with the actual user ID

    // Retrieve the user's image filename
    const user = await model.getUser(userId);
    // Check if the user has an existing image
    if (user.image || user.image != null) {
      // Construct the path to the existing image
      const imagePath = `./public/images/user/${user.image}`;

      // Remove the existing image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          res.redirect('/error');
          return;
        }
      });
    }

    // Check if a new image was uploaded
    if (req.file && req.file.filename) {
      // Update the user's image filename in the database
      await model.updateImgUser(req.file.filename, userId);
      console.log("image to db: " + req.file.filename);
    }

    res.redirect('/user/profile');
  } catch (error) {
    console.error(error);
    res.redirect('/error');
  }
});

router.post('/handleorder', async function(req, res) {
  const command = req.body.command;
  const userId = 1;
  const productId = req.body.productid;
  try {
    const quantity = req.body.quantity;
    const price = req.body.discountprice;
    const totalPrice = quantity * price;

    await model.addToCart(userId, productId, quantity, totalPrice);
    if (command == 'cart')
    {
      res.redirect('/product');
    }
    else
    {
      res.redirect('/user/cart');
    }
  } catch (error) {
    console.log(error);
    res.redirect('error');
  }
});

router.get('/cart', async function(req, res) {
  const userId = 1;
  let tmpPrice = 0;
  let totalPrice = 0;
  try {
    const user = await model.getUser(userId);
    const cart = await model.getCart(userId);

    for (let i = 0; i < cart.length; i++) {
      tmpPrice += parseFloat(cart[i].totalprice); // Parse the value as a float and add it to the total
    }
    totalPrice = tmpPrice + 15000;

    res.render('user/cart', { 
        title: 'Giỏ hàng',
        user: user,
        cart: cart,
        tmpPrice: tmpPrice,
        totalPrice: totalPrice
    });
  } catch (error) {
    res.redirect('error');
  }
});

router.post('/cart', async function(req, res) {
  const quantity = req.body.quantity;
  const productId = req.body.productid;
  const cartId = req.body.cartid;
  try {
    const productPrice = await model.getProductPrice(productId);
    let totalPrice = productPrice.discountprice * quantity;
    console.log(totalPrice);
    console.log(cartId);  
    await model.changeQuantityCart(quantity, totalPrice, cartId);

    res.redirect('/user/cart');
  } catch (error) {
    res.redirect('error');
  }
});

router.post('/checkout', async function(req, res) {
  const note = req.body.note;
  const userId = 1;
  try {
    const cart = await model.getCart(userId);

    const dateorder = new Date();
    const status = false;
    await model.newOrder(userId, dateorder, status, note);

    const orderId = await model.getOrderId(userId);

    for (let i = 0; i < cart.length; i++) {
      await model.addToDetails(orderId.orderid, cart[i].product_id, cart[i].quantity, cart[i].totalprice);
      await model.deletePurchasedProduct(cart[i].cartid);
    }

    res.redirect('/user/payment');
  } catch (error) {
    console.log(error);
    res.redirect('/error');
  }
});

router.get('/payment', async function(req, res) {
  const userId = 1;
  let totalPrice = 0;
  let note = "";
  try {
    let details = {};
    const order = await model.getOrderIdUnpaid(userId);
    const user = await model.getUser(userId);
    if (order != null || order != undefined) {
      details = await model.getDetails(order.orderid);
      note = order.note;
    }
    else
    {
      res.redirect('/product');
    }

    for (let i = 0; i < details.length; i++) {
      totalPrice += parseFloat(details[i].totalprice); // Parse the value as a float and add it to the total
    }

    res.render('user/payment', { 
        title: 'Thanh toán',
        user: user,
        details: details,
        totalPrice: totalPrice + 15000,
        note: note
    });
  } catch (error) {
    console.log(error);
    res.redirect('error');
  }
});

router.get('/payment/:orderid', async function(req, res) {
  const orderId = req.params.orderid;
  const userId = 1;
  let totalPrice = 0;
  let note = "";
  try {
    let details = {};
    const order = await model.getOrder(orderId);
    const user = await model.getUser(userId);
    details = await model.getDetails(order.orderid);
    note = order.note;

    for (let i = 0; i < details.length; i++) {
      totalPrice += parseFloat(details[i].totalprice); // Parse the value as a float and add it to the total
    }

    res.render('user/payment', { 
        title: 'Thanh toán',
        user: user,
        details: details,
        totalPrice: totalPrice + 15000,
        note: note,
        status: order.status
    });
  } catch (error) {
    console.log(error);
    res.redirect('error');
  }
});

router.get('/paid', async function(req, res) {
  const userId = 1;
  try {
    const order = await model.getOrderIdUnpaid(userId);
    await model.updateOrder(order.orderid);

    res.redirect('/user/profile');
  } catch (error) {
    console.log(error);
    res.redirect('error');
  }
});

module.exports = router;
