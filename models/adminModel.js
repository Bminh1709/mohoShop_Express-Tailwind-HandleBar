const db = require('../databasebg');

const admin = {
    // ==== PRODUCTS ====
    getHotProducts: async function () {
        const query = await db.query('SELECT * FROM products WHERE hot = true');
        return query.rows;
    },
    getHotProduct: async function (productid) {
        const query = await db.query('SELECT * FROM products WHERE productid = $1 AND hot = true', [productid]);
        return query.rows[0];
    },
    setHotProductFalse: async function (productid) {
        const query = await db.query('UPDATE products SET hot = false WHERE productid = $1', [productid]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    setHotProductTrue: async function (productid) {
        const query = await db.query('UPDATE products SET hot = true WHERE productid = $1', [productid]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    getProducts: async function () {
        const query = await db.query('SELECT P.productid, P.image, P.productname, C.categoryname, P.price, P.discountprice, P.description, P.hot FROM products P LEFT JOIN categories C ON P.category_id = C.categoryid');
        return query.rows;
    },
    getProductsWFilter: async function (filter) {
        const query = await db.query('SELECT P.productid, P.image, P.productname, C.categoryname, P.price, P.discountprice, P.description, P.hot FROM products P LEFT JOIN categories C ON P.category_id = C.categoryid WHERE P.productname ILIKE $1', [`%${filter}%`]);
        return query.rows;
    },
    getProduct: async function (productid) {
        const query = await db.query('SELECT * FROM products WHERE productid = $1', [productid]);
        return query.rows[0];
    },
    addProduct: async function (product) {
        const query = await db.query('INSERT INTO products (productname, category_id, discountprice, price, description, detaildescription, image) VALUES ($1, $2, $3, $4, $5, $6, $7)', [product.productname, product.category, product.discountprice, product.price, product.description, product.detaildescription, product.image]);
        if (query.rowCount > 0) return true; // Product added successfully
        else return false; // No rows affected, product not added
    },
    deleteProduct: async function (productid) {
        const query = await db.query('DELETE FROM products WHERE productid = $1', [productid]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    updateProduct: async function (product) {
        const query = await db.query('UPDATE products SET productname = $1, category_id = $2, price = $3, discountprice = $4, description = $5, detaildescription = $6 WHERE productid = $7', [product.productname, product.category, product.price, product.discountprice, product.description, product.detaildescription, product.productid]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    updateProductWImg: async function (product) {
        const query = await db.query('UPDATE products SET productname = $1, category_id = $2, price = $3, discountprice = $4, description = $5, detaildescription = $6, image = $7 WHERE productid = $8', [product.productname, product.category, product.price, product.discountprice, product.description, product.detaildescription, product.image, product.productid]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    // ==== CATEGORIES ====
    getCategories: async function () {
        const query = await db.query('SELECT * FROM categories');
        return query.rows;
    },
    getCategory: async function (categoryId) {
        const query = await db.query('SELECT * FROM categories WHERE categoryid = $1', [categoryId]);
        return query.rows[0];
    },
    addCategory: async function (categoryname) {
        const query = await db.query('INSERT INTO categories (categoryname) VALUES ($1)', [categoryname]);
        if (query.rowCount > 0) return true; // Category added successfully
        else return false; // No rows affected, category not added
    },
    deleteCategory: async function (categoryId) {
        const query = await db.query('DELETE FROM categories WHERE categoryid = $1', [categoryId]);
        if (query.rowCount > 0) return true; 
        else return false; 
    },
    updateCategory: async function (categoryId, categoryname) {
        const query = await db.query('UPDATE categories SET categoryname = $1 WHERE categoryid = $2', [categoryname, categoryId]);
        if (query.rowCount > 0) return true; 
        else return false;
    },
    // ==== ORDERS ====
    // ==== REVENUES ====
};

module.exports = admin;
