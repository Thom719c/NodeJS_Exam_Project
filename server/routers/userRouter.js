import { Router } from "express"
const router = Router();
import bcrypt from "bcrypt"
import {
    getProfileImageByGamertag,
    getAllOwnedGameByGamertag, addOwnedGameToUser,
    removeGameFromOwnedList,
    getAllWishlistGamesByGamertag, addGameToWishlist,
    removeGameFromWishlist
} from "../database/userQueries.js";

router.get("/profileImage", async (req, res) => {
    if (!req.session.user) {
        return res.status(404).send({ message: "Need to be logged in!" });
    }
    const user = await getProfileImageByGamertag(req.session.user?.gamertag);
    res.status(200).send({ data: user });
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

router.post("/ownedGames", async (req, res) => {
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