import { Router } from "express"
const router = Router();
import bcrypt from "bcrypt"
import {
    getUserByEmail, getUserByGamertag, getProfileImageByGamertag, checkIfUserExist,
    create, update, updateUserPassword,
    getEmailByPasswordResetToken, deletePasswordResetToken,
    getAllOwnedGameByGamertag, addOwnedGameToUser,
    removeGameFromOwnedList,
    getAllWishlistGamesByGamertag, addGameToWishlist,
    removeGameFromWishlist
} from "../database/userQueries.js";


router.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.status(200).send({});
    })
});

//Route for testing purposes...
router.get("/allUsers", async (req, res) => {
    const users = await db.all("SELECT * FROM users");
    res.send({ data: users });
});

router.get("/profileImage", async (req, res) => {
    if (!req.session.user) {
        return res.status(404).send({ message: "Need to be logged in!" });
    }
    const user = await getProfileImageByGamertag(req.session.user?.gamertag);
    res.status(200).send({ data: user });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Missing the keys (email and password) in the body" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(404).send({ message: "User was not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(404).send({ message: "Email or password did not match" });
    }
    req.session.user = {
        gamertag: user.gamertag,
        name: user.name,
        email: user.email
    }
    res.send({ session: req.session, message: "Login successful" });
});

router.post("/signup", async (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
        return res.status(400).send({ message: "Missing the keys (email and password) in the body" });
    }

    // Check if a user with the given username or email exists
    const userExist = await checkIfUserExist(user.email, user.username);
    if (userExist) {
        return res.status(409).json({ message: "User with this username or e-mail already exists" });
    }

    user.encryptedPassword = await bcrypt.hash(user.password, 12);

    await create(user);

    res.status(201).send({ message: 'User successfully created, you may now login' });
});

router.post("/validatepassword", async (req, res) => {
    const { password } = req.body;

    if (!req.session.user?.gamertag || !password) {
        return res.status(400).json({ message: "The password entered doesn't match your account" });
    }

    const data = await getUserByGamertag(req.session.user.gamertag);
    if (!data) {
        return res.status(401).send({ message: "Email/Gamertag or password is incorrect." });
    }

    // check if the entered password matches the user's password
    const isPasswordMatch = await bcrypt.compare(password, data.password);
    if (isPasswordMatch) {
        res.status(200).send({ message: 'Password was correct.' });
    } else {
        res.status(401).send({ message: "Email/Gamertag or password is not correct." });
    }
});



router.patch("/updateAccount", async (req, res) => {

    if (!req.session.user) {
        return res.status(404).send({ message: "Need to be logged in!" });
    }

    const foundUser = await getUserByGamertag(req.session.user.gamertag)

    const user = {
        id: foundUser.id,
        gamertag: foundUser.gamertag, 
        name: req.body.name || foundUser.name,
        phoneNumber: foundUser.phone_number,
        email: req.body.email || foundUser.email,
        password: foundUser.password,
        profileImage: req.body.profileImage || foundUser.profile_image,
        role: req.body.role || foundUser.role,
    }
    
    await update(user)
    req.session.regenerate((error) => {
        if (error) {
            return res.status(500).send({ message: "Failed to regenerate session." });
        }      
        req.session.user = {
            gamertag: foundUser.gamertag,
            name: user.name,
            email: user.email
        }
        res.status(200).send({ session: req.session, message: "Account update successful" });
    });
})

/* Owned games */
router.get("/ownedGames", async (req, res) => {
    const gamertag = req.session.user?.gamertag;
    if (!gamertag || !req.session.user) {
        return res.status(400).send({ message: "Need to be logged in!" });
    }

    const ownedGames = await getAllOwnedGameByGamertag(gamertag);

    res.status(200).send({ message: 'All owned games', data: ownedGames });
});

router.post("/addOwnedGame", async (req, res) => {
    const game = req.body;

    if (!game.steamAppId || !game.name || !req.session.user?.gamertag) {
        return res.status(400).send({ message: "Missing the keys in the body or not logged in, if is logged in try login again." });
    }

    // Get all games that user owned and Check if the game is already in the owned games list
    const ownedGames = await getAllOwnedGameByGamertag(req.session.user.gamertag);
    const gameExists = ownedGames.find((ownedGame) => ownedGame.steam_app_id === game.steamAppId);
    if (gameExists) {
        return res.status(409).send({ message: "Game already on the list" });
    }

    await addOwnedGameToUser(req.session.user.gamertag, game);

    res.status(201).send({ message: 'Game added successfully to owned games' });
});

router.delete("/ownedGames", async (req, res) => {
    const game = req.body;

    if (!game.steamAppId || !game.name || !req.session.user?.gamertag) {
        return res.status(400).send({ message: "Missing the keys in the body or not logged in, if is logged in try login again." });
    }

    await removeGameFromOwnedList(req.session.user.gamertag, game);

    res.status(201).send({ message: game.name + ' removed successfully from the owned games' });
});

/* Wishlist */
router.get("/wishlist", async (req, res) => {
    const gamertag = req.session.user?.gamertag;
    if (!gamertag || !req.session.user) {
        return res.status(400).send({ message: "Need to be logged in!" });
    }

    const wishlist = await getAllWishlistGamesByGamertag(gamertag);

    res.status(200).send({ message: 'All games on wishlist', data: wishlist });
});

router.post("/wishlist", async (req, res) => {
    const game = req.body;

    if (!game.steamAppId || !game.name || !req.session.user?.gamertag) {
        return res.status(400).send({ message: "Missing the keys in the body or not logged in, if is logged in try login again." });
    }

    // Get all games that user owned and Check if the game is already in the owned games list
    const wishlist = await getAllWishlistGamesByGamertag(req.session.user.gamertag);
    const gameExists = wishlist.find((wishlistedGame) => wishlistedGame.steam_app_id === game.steamAppId);
    if (gameExists) {
        return res.status(409).send({ message: "Game already on the wishlist" });
    }

    await addGameToWishlist(req.session.user.gamertag, game);

    res.status(201).send({ message: 'Game added successfully to the wishlist' });
});

router.delete("/wishlist", async (req, res) => {
    const game = req.body;

    if (!game.steamAppId || !game.name || !req.session.user?.gamertag) {
        return res.status(400).send({ message: "Missing the keys in the body or not logged in, if is logged in try login again." });
    }

    await removeGameFromWishlist(req.session.user.gamertag, game);

    res.status(201).send({ message: 'Game removed successfully from the wishlist' });
});

export default router