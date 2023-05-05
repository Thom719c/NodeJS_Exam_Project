import { Router } from "express"
const router = Router();
import bcrypt from "bcrypt"
import { getUserByEmail, getUserByGamertag, checkIfUserExist, 
    create, update, updateUserPassword, 
    getEmailByPasswordResetToken, deletePasswordResetToken,
    getAllOwnedGameByGamertag, addOwnedGameToUser } from "../database/userQueries.js";


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

    if (!game.steamAppId || !game.name || !req.session.user.gamertag) {
        return res.status(400).send({ message: "Missing the keys in the body or not logged in." });
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

export default router