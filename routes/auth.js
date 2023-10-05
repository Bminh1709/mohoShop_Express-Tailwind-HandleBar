var express = require('express');
var router = express.Router();
const model = require('../models/authModel'); 

// === ADMIN ACCESS ===
router.get('/admin', function(req, res) {
    res.render('admin/adminAccess', { title: 'Đăng nhập'});
});
router.post('/admin', async (req, res) => {
    let uname = req.body.username;
    let pword = req.body.password;
    try {
        const checkAccount = await model.isAdminExist(uname, pword);
    
        if (checkAccount)
            res.redirect('/admin');
        else
            res.render('admin/adminAccess', { title: 'Đăng nhập', message: 'Sai tài khoản hoặc mật khẩu' });
    } catch (error) {
        console.log(error);
        res.redirect('/error');
    }
});

module.exports = router;