const db = require('../databasebg'); 

const user = {
    getUser: async function (userId) {
        const query = await db.query('SELECT * FROM users WHERE userid = $1', [userId]);
        return query.rows[0];
    },
    getCart: async function (userId) {
        const query = await db.query('SELECT * FROM carts C LEFT JOIN products P ON P.productid = C.product_id WHERE user_id = $1 ORDER BY C.cartid', [userId]);
        return query.rows;
    },
    getProductPrice: async function (productId) {
        const query = await db.query('SELECT discountprice FROM products WHERE productid = $1', [productId]);
        return query.rows[0];
    },
    getFavorites: async function (userId) {
        const query = await db.query('SELECT * FROM favorites F LEFT JOIN products P ON F.product_id = P.productid WHERE user_id = $1', [userId]);
        return query.rows;
    },
    getFavorite: async function (userId, productId) {
        const query = await db.query('SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2', [userId, productId]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    addFavorite: async function (userId, productId) {
        const query = await db.query('INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)', [userId, productId]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    deleteFavorite: async function (favoriteId) {
        const query = await db.query('DELETE FROM favorites WHERE favoriteid = $1;', [favoriteId]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    updateUser: async function (user, userId) {
        const query = await db.query('UPDATE users SET phone = $1, password = $2, fullname = $3, address = $4 WHERE userid = $5;', [user.phone, user.password, user.fullname, user.address, userId]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    updateImgUser: async function (image, userId) {
        const query = await db.query('UPDATE users SET image = $1 WHERE userid = $2;', [image, userId]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    addToCart: async function (userId, productId, quantity, totalPrice) {
        const query = await db.query('INSERT INTO carts (user_id, product_id, quantity, totalprice) VALUES ($1,$2,$3,$4);', [userId, productId, quantity, totalPrice]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    changeQuantityCart: async function (quantity, totalPrice, cartId) {
        const query = await db.query('UPDATE carts SET quantity = $1, totalPrice = $2 WHERE cartid = $3', [quantity, totalPrice, cartId]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    newOrder: async function (userId, dateorder, status, note) {
        const query = await db.query('INSERT INTO orders (user_id, dateorder, status, note) VALUES ($1,$2,$3,$4);', [userId, dateorder, status, note]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    addToDetails: async function (orderId, productId, quantity, totalPrice) {
        const query = await db.query('INSERT INTO details (order_id, product_id, quantity, totalprice) VALUES ($1,$2,$3,$4);', [orderId, productId, quantity, totalPrice]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    getOrderId: async function (userId) {
        const query = await db.query('SELECT * FROM orders WHERE user_id = $1;', [userId]);
        return query.rows[0];
    },
    getOrderIdUnpaid: async function (userId) {
        const query = await db.query('SELECT * FROM orders WHERE user_id = $1 AND status = false;', [userId]);
        return query.rows[0];
    },
    deletePurchasedProduct: async function (cartId) {
        const query = await db.query('DELETE FROM carts WHERE cartid = $1;', [cartId]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    getDetails: async function (orderId) {
        const query = await db.query('SELECT * FROM details C LEFT JOIN products P ON P.productid = C.product_id WHERE C.order_id = $1', [orderId]);
        return query.rows;
    },
    updateOrder: async function (orderId) {
        const query = await db.query('UPDATE orders SET status = true WHERE orderid = $1', [orderId]);
        if (query.rowCount > 0) return true;
        else return false;
    },
    getOrders: async function (userId) {
        const query = await db.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
        return query.rows;
    },
    getOrder: async function (orderId) {
        const query = await db.query('SELECT * FROM orders WHERE orderid = $1', [orderId]);
        return query.rows[0];
    },
}

module.exports = user;