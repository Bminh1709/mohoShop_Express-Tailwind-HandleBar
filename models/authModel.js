const db = require('../databasebg'); 

const auth = {
    isAdminExist: async function (username, password) {
        let check = false;
        let uname = username;
        let pword = password;
        const query = await db.query('SELECT * FROM admins WHERE username = $1 AND password = $2', [uname, pword]);
        if (query.rowCount == 1)
        {
            check = true;
        }
        return check;
    }
}

module.exports = auth;