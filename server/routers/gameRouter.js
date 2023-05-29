import db from "../database/connection.js";
import { Router } from "express";
const router = Router();

router.get("/games", async (req, res) => {
    const [rows] = await db.query(`SELECT * FROM games`);

    res.status(200).send({ message: "All games", data: rows });
});

router.post("/games", async (req, res) => {
    if (!req.session.user) {
        return res.status(404).send({ message: "Need to be logged in!" });
    }

    const game = req.body;

    if (!game.name || !game.image || !game.src || !game.genre || !game.isGamingOasis) {
        return res.status(404).send({ message: "One or more fields are not filled out." });
    }

    if (game.isGamingOasis === "others") {
        game.isGamingOasis = false;
    } else {
        game.isGamingOasis = true;
    }

    const query = 'INSERT INTO games (name, image, src, genre, is_gaming_oasis) VALUES (?, ?, ?, ?, ?)';
    const values = [game.name, game.image, game.src, game.genre, game.isGamingOasis];
    await db.query(query, values);

    res.status(200).send({ message: "Game added successfully" });
});

router.delete("/games", async (req, res) => {
    if (!req.session.user) {
        return res.status(404).send({ message: "Need to be logged in!" });
    }
    
    if (req.session.user.role !== "admin") {
        return res.status(404).send({ message: "You don't have access to remove game!" });
    }

    const game = req.body;
    const query = 'DELETE FROM games WHERE id = ?';
    const values = [game.id];
    await db.query(query, values);

    res.status(200).send({ message: "Removed game successfully" });
});

export default router;