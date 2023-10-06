var express = require('express');
var router = express.Router();
const model = require('../../models/adminModel'); 

router.get('/', async (req, res) => {
   try {
    const categories = await model.getCategories();

    res.render('admin/adminCategory', {
      title: 'Thể loại',
      layout: 'manage',
      activeNav: 1,
      categories: categories,
      addAction: true
    });
  } catch (error) {
    res.redirect('/error');
  }
});

router.post('/', async (req, res) => {
  try {
    const categoryname = req.body.category;
    const resultAddCategory = await model.addCategory(categoryname);
    res.redirect('/admin/category');
  } catch (error) {
    res.redirect('/error');
  }
});

router.get('/delete/:categoryid', async (req, res) => {
  try {
    const categoryId = req.params.categoryid;
    const resultDeleteCategory = await model.deleteCategory(categoryId);
    res.redirect('/admin/category');
  } catch (error) {
    console.log(error);
      res.redirect('/error');
  }
});

router.get('/update/:categoryid', async (req, res) => {
  try {
    const categoryId = req.params.categoryid;
    const categoryFound = await model.getCategory(categoryId);

    res.render('admin/adminCategory', {
      title: 'Thể loại',
      layout: 'manage',
      activeNav: 1,
      category: categoryFound
    });
  } catch (error) {
    console.log(error);
      res.redirect('/error');
  }
});

router.post('/update/:categoryid', async (req, res) => {
  try {
    const categoryId = req.params.categoryid;
    const categoryname = req.body.category;
    const resultDeleteCategory = await model.updateCategory(categoryId, categoryname);
    res.redirect('/admin/category');
  } catch (error) {
      res.redirect('/error');
  }
});


module.exports = router;