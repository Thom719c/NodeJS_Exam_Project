import db from "./connection.js";
import { v4 as uuidv4 } from 'uuid';

async function getUserByEmail(email) {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
}

async function getUserByUsername(username) {
    const [rows] = await db.query(`SELECT * FROM users WHERE username = ?`, [username]);
    return rows[0];
}

async function checkIfUserExist(email, username) {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ? OR username = ?`,
        [email, username]
    );
    return rows[0];
}

async function create(user) {
    // Insert the new user data into the database
    const query = 'INSERT INTO users (name, gamertag, phone_number, email, password, owned_games, wish_list_games, events, friends, posts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [user.name, user.gamertag, user.phoneNumber, user.email, user.encryptedPassword, user.ownedGames, user.wishListGames, user.events, user.friends, user.posts];
    await db.query(query, values);
}

async function update(user) {
    await db.query(`UPDATE users 
        SET name = ?, phone_number = ?, email = ?, password = ?
        WHERE id = ?`,
        [user.name, user.phoneNumber, user.email, user.password, user.id]
    );
}

async function updateUserPassword(encryptedPassword, email) {
    await db.query('UPDATE users SET password = ? WHERE email = ?', [encryptedPassword, email]);
}

/* Password Reset Token */
async function getEmailByPasswordResetToken(token) {
    const [rows] = await db.query('SELECT email, expires_at FROM password_reset_tokens WHERE token = ?', [token]);
    if (rows.length === 0) {
        return null;
    }

    const expirationTime = new Date(rows[0].expires_at);
    if (expirationTime < new Date()) {
        console.log("Token has expried")
        // Token has expired, delete it from the database
        await deletePasswordResetToken(token);
        return null; // Invalid token
    }

    return rows[0];
}

async function createPasswordResetTokenInDB(email) {
    // Generate a unique token
    const token = uuidv4();

    // Set expiration time to 1 min from now (Testing)
    // const expirationTime = new Date(Date.now() + 60 * 1000); 
    // Set expiration time to 1 hour from now
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);

    // Save the token, user's email, and expiration time in the database
    await db.query('INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)', [email, token, expirationTime]);

    return token;
}

async function deletePasswordResetToken(token) {
    await db.query('DELETE FROM password_reset_tokens WHERE token = ?', [token]);
}


export {
    getUserByEmail,
    getUserByUsername,
    checkIfUserExist,
    create,
    update,
    updateUserPassword,
    getEmailByPasswordResetToken,
    createPasswordResetTokenInDB,
    deletePasswordResetToken
};