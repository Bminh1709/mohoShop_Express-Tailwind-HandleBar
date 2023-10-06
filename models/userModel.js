const db = require('../databasebg'); 

const user = {
    getUser: async function (userId) {
        const query = await db.query('SELECT * FROM users WHERE userid = $1', [userId]);
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
}

module.exports = user;