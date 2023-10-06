const db = require('../databasebg'); 

const product = {
    getCategoryname: async function (categoryId) {
        const query = await db.query('SELECT categoryname FROM categories WHERE categoryid = $1',[categoryId]);
        return query.rows[0].categoryname;
    },
    getProduct: async function (productId) {
        const query = await db.query('SELECT P.*, C.categoryname FROM products P LEFT JOIN categories C ON P.category_id = C.categoryId WHERE P.productid = $1', [productId]);
        return query.rows[0];
    },
    getProducts: async function () {
        const query = await db.query('SELECT * FROM products');
        return query.rows;
    },
    getProductsWFilter: async function (filter) {
        const query = await db.query('SELECT * FROM products WHERE productname ILIKE $1', [`%${filter}%`]);
        return query.rows;
    },
    getHotProducts: async function () {
        const query = await db.query('SELECT * FROM products WHERE hot = true LIMIT 3');
        return query.rows;
    },
    getBtts: async function () {
        const query = await db.query('SELECT * FROM products WHERE category_id = 1 LIMIT 4');
        return query.rows;
    },
    getKus: async function () {
        const query = await db.query('SELECT * FROM products WHERE category_id = 2 LIMIT 4');
        return query.rows;
    },
    getProductsByCat: async function (categoryId) {
        const query = await db.query('SELECT * FROM products WHERE category_id = $1', [categoryId]);
        return query.rows;
    }
}

module.exports = product;