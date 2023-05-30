import db from "./connection.js";
import { v4 as uuidv4 } from 'uuid';

async function getAllUsers(gamertag) {
    const query = 'SELECT gamertag, profile_image, name, email FROM users WHERE gamertag != ?';
    const [rows] = await db.query(query, [gamertag]);
    return rows;
}

async function getSpecificUserByGamertag(gamertag) {
    const query = 'SELECT gamertag, profile_image, name, email FROM users where gamertag = ?';
    const [rows] = await db.query(query, [gamertag]);
    return rows;
}

async function getUserByEmail(email) {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
}

async function getUserByGamertag(gamertag) {
    const [rows] = await db.query(`SELECT * FROM users WHERE gamertag = ?`, [gamertag]);
    return rows[0];
}

async function getProfileImageByGamertag(gamertag) {
    const [rows] = await db.query(`SELECT profile_image FROM users WHERE gamertag = ?`, [gamertag]);
    return rows[0];
}

async function checkIfUserExist(email, gamertag) {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ? OR gamertag = ?`,
        [email, gamertag]
    );
    return rows[0];
}

async function create(user) {
    // Insert the new user data into the database
    // const query = 'INSERT INTO users (name, gamertag, phone_number, email, password, owned_games, wish_list_games, events, friends, posts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    // const values = [user.name, user.gamertag, user.phoneNumber, user.email, user.encryptedPassword, user.ownedGames, user.wishListGames, user.events, user.friends, user.posts];
    const query = 'INSERT INTO users (name, gamertag, phone_number, email, password) VALUES (?, ?, ?, ?, ?)';
    const values = [user.name, user.gamertag, user.phoneNumber, user.email, user.encryptedPassword];
    await db.query(query, values);
}

async function update(user) {
    const [rows] = await db.query(`UPDATE users 
        SET name = ?, phone_number = ?, gamertag = ?, email = ?, password = ?, profile_image = ?, role = ?
        WHERE id = ?`,
        [user.name, user.phoneNumber, user.gamertag, user.email, user.password, user.profileImage, user.role, user.id]
    );
    return rows[0];
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


/* Owned Games */
async function getAllOwnedGameByGamertag(gamertag) {
    const query = 'SELECT og.steam_app_id, og.game_name FROM users u JOIN owned_games og ON u.id = og.user_id WHERE u.gamertag = ?';
    const values = [gamertag];
    const [rows] = await db.query(query, values);
    return rows;
}

/**
 * Finds user from gamertag by the method getUserByGamertag(gamertag) so we can get the user id
 * @param {*} gamertag 
 * @param {*} game 
 */
async function addOwnedGameToUser(gamertag, game) {
    const user = await getUserByGamertag(gamertag);

    const query = 'INSERT INTO owned_games (user_id, steam_app_id, game_name) VALUES (?, ?, ?)';
    const values = [user.id, game.steamAppId, game.name];
    await db.query(query, values);
}

async function removeGameFromOwnedList(gamertag, game) {
    const user = await getUserByGamertag(gamertag);

    const query = 'DELETE FROM owned_games WHERE user_id = ? AND steam_app_id = ?';
    const values = [user.id, game.steamAppId];
    await db.query(query, values);
}

/* wishlist */
async function getAllWishlistGamesByGamertag(gamertag) {
    const query = 'SELECT w.steam_app_id, w.game_name FROM users u JOIN wishlist w ON u.id = w.user_id WHERE u.gamertag = ?';
    const values = [gamertag];
    const [rows] = await db.query(query, values);
    return rows;
}

/**
 * Finds user from gamertag by the method getUserByGamertag(gamertag) so we can get the user id
 * @param {*} gamertag 
 * @param {*} game 
 */
async function addGameToWishlist(gamertag, game) {
    const user = await getUserByGamertag(gamertag);

    const query = 'INSERT INTO wishlist (user_id, steam_app_id, game_name) VALUES (?, ?, ?)';
    const values = [user.id, game.steamAppId, game.name];
    await db.query(query, values);
}

async function removeGameFromWishlist(gamertag, game) {
    const user = await getUserByGamertag(gamertag);

    const query = 'DELETE FROM wishlist WHERE user_id = ? AND steam_app_id = ?';
    const values = [user.id, game.steamAppId];
    await db.query(query, values);
}

/*Community Hub*/

async function removePost(gamertag, postId) {
    const user = await getUserByGamertag(gamertag);

    await removeCommentsByPostId(user, postId);

    const query = 'DELETE FROM posts WHERE user_id = ? AND id = ?';
    const values = [user.id, postId];
    await db.query(query, values);
}

async function removeComment(gamertag, postId, commentId) {
    const user = await getUserByGamertag(gamertag);

    const query = 'DELETE FROM comments WHERE user_id = ? AND id = ? AND post_id = ?';
    const values = [user.id, commentId, postId];
    await db.query(query, values);
}

async function removeCommentsByPostId(user, postId) {
    const query = 'DELETE FROM comments WHERE user_id = ? AND post_id = ?';
    const values = [user.id, postId];
    await db.query(query, values);
}

/* Friendlist */

async function getAllFriendlistByGamertag(gamertag) {
    const query = 'SELECT f.user_id, f.name, f.email, f.gamertag, f.profile_image FROM users u JOIN friendlist f ON u.id = f.user_id WHERE u.gamertag = ?';
    const values = [gamertag];
    const [rows] = await db.query(query, values);
    return rows;
}

async function addUserToFriendlist(gamertag, friend) {
    const user = await getUserByGamertag(gamertag);
    
    const query = 'INSERT INTO friendlist (user_id, name, email, profile_image, gamertag) VALUES (?, ?, ?, ?, ?)';
    const values = [user.id, friend.name, friend.email, friend.profile_image, friend.gamertag];
    await db.query(query, values);

    await addFriendToUsersFriendlist(user, friend);
}

async function addFriendToUsersFriendlist(user, friend) {
    const friendFound = await getUserByGamertag(friend.gamertag);
    const queryFriend = 'INSERT INTO friendlist (user_id, name, email, profile_image, gamertag) VALUES (?, ?, ?, ?, ?)';
    const valuesFriend = [friendFound.id, user.name, user.email, user.profile_image, user.gamertag];
    await db.query(queryFriend, valuesFriend);
}

async function removeFriendFromFriendList(gamertag, friend) {
    const user = await getUserByGamertag(gamertag);
    
    const query = 'DELETE FROM friendlist WHERE user_id = ? AND gamertag = ?';
    const values = [user.id, friend.gamertag];
    await db.query(query, values);
    
    await removeUserFromFriendsFriendlist(gamertag, friend)
}

async function removeUserFromFriendsFriendlist(gamertag, friend) {
    const friendFound = await getUserByGamertag(friend.gamertag);
    const query = 'DELETE FROM friendlist WHERE user_id = ? AND gamertag = ?';
    const values = [friendFound.id, gamertag];
    await db.query(query, values);
}


export {
    getAllUsers,
    getSpecificUserByGamertag,
    getUserByEmail,
    getUserByGamertag,
    getProfileImageByGamertag,
    checkIfUserExist,
    create,
    update,
    updateUserPassword,
    getEmailByPasswordResetToken,
    createPasswordResetTokenInDB,
    deletePasswordResetToken,
    getAllOwnedGameByGamertag,
    addOwnedGameToUser,
    removeGameFromOwnedList,
    getAllWishlistGamesByGamertag,
    addGameToWishlist,
    removeGameFromWishlist,
    removePost,
    removeComment,
    getAllFriendlistByGamertag,
    addUserToFriendlist,
    removeFriendFromFriendList,
};