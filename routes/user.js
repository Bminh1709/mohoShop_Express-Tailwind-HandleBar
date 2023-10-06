var express = require('express');
var router = express.Router();
const model = require('../models/userModel'); 

/* GET users listing. */
router.get('/profile', async function(req, res) {
  const userId = 1;
  try {
    const user = await model.getUser(userId);
    const favorites = await model.getFavorites(userId);

    res.render('user/profile', { 
        title: 'Trang cá nhân',
        user: user,
        favorites: favorites
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

router.post('/profile/image', async function(req, res) {
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

module.exports = router;
