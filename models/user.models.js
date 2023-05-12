const db = require("../../database");
const crypto = require("crypto");

const getAllUsers = (done) => {
    const results = [];
    db.each(
        "SELECT * FROM users",
        [],
        (err, row) => {
            if (err) console.log("Something went wrong: " + err);

            results.push({
                user_id: row.user_id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,

            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    )
}

const getHash = function (password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
}

const addNewUser = (users, done) => {
    const salt = crypto.randomBytes(64);
    const hash = getHash(users.password, salt);

    const sql = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?,?,?,?,?)';
    let values = [users.first_name, users.last_name, users.email, hash, salt.toString('hex')];

    db.run(sql, values, function (err) {
        if (err) return done(err);
        return done(null, this.lastID);
    }
    )

}

const authenticateUser = (email, password, done) => {
    //function takes in the email and password from the user
    const sql = 'SELECT user_id, password, salt FROM users WHERE email=?'
    //get the id,hashed password and salt from the DB
    db.get(sql, [email], (err, row) => {
        if (err) return done(err)
        if (!row) return done(404) //wrong email

        if (row.salt === null) row.salt = ''
        //convert the salt from hex(how its encoded)
        let salt = Buffer.from(row.salt, 'hex')
        //call the getHash password and compare with the saved hash
        if (row.password === getHash(password, salt)) {
            return done(false, row.user_id)
        } else {
            return done(404) // wrong password
        }
    })
}

const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');

    const sql = 'UPDATE users SET session_token=? WHERE user_id=?'

    db.run(sql, [token, id], (err) => {
        return done(err, token)
    })
}
//get the token from the user's token where the user's ID matches the parameterID
const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id=?'

    db.get(sql, [id], (err, row) => {
        if (err) return done(err)
        if (!row) return done(404)

        return done(false, row.session_token)
    })
}

const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token=null WHERE session_token=?'

    db.run(sql, [token], (err) => {
        return done(err)
    })
}

const getIdFromToken = (token, done) => {
    const sql = 'SELECT user_id FROM users WHERE session_token=?'
    const params = [token]

    db.get(sql, params, (err, row) => {
        if (err) return done(err)
        if (!row) return done(404)

        return done(null, row.session_token)
    })
}

module.exports = {
    getAllUsers: getAllUsers,
    addNewUser: addNewUser,
    authenticateUser: authenticateUser,
    setToken: setToken,
    getToken: getToken,
    removeToken: removeToken,
    getIdFromToken: getIdFromToken,
}

