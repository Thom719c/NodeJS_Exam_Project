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
    
    const query = 'INSERT INTO games (name, image, src, genre, is_gaming_oasis) VALUES (?, ?, ?, ?, ?)';
    const values = [user.id, game.steamAppId, game.name];
    await db.query(query, values);

    res.status(200).send({ message: "Game added successfully" });
});

export default router;