import { v4 as uuidv4 } from "uuid";
import db from "../database/connection.js";
import { getUserByGamertag } from "../database/userQueries.js";
import { Router } from "express"
const router = Router();


// Global community chat route
router.get("/global", (req, res) => {
    // Handle global community chat logic here
});

// Private community chat route
router.get("/private", (req, res) => {
    // Handle private community chat logic here
});

router.get("/posts", async (req, res) => {
    const [rows] = await db.query(`SELECT id, user_id, gamertags, title, content, state, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at FROM posts`);

    res.status(200).send({ message: "All posts", data: rows });
});

router.get("/posts/:id", async (req, res) => {
    const postId = req.params.id;

    try {
        // Retrieve the post
        const [postRows] = await db.query("SELECT id, user_id, gamertags, title, content, state, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at FROM posts WHERE id = ?", [postId]);
        if (postRows.length === 0) {
            return res.status(404).send({ message: "Post not found" });
        }
        const post = postRows[0];

        // Retrieve the comments for the post
        const [commentRows] = await db.query("SELECT id, post_id, user_id, gamertag, content, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM comments WHERE post_id = ?", [postId]);
        const comments = commentRows;

        // Combine the post and comments data
        const postData = {
            post,
            comments,
        };

        res.status(200).send({ message: "Post and comments", data: postData });
    } catch (error) {
        console.error("Failed to retrieve post and comments:", error);
        res.status(500).send({ message: "Failed to retrieve post and comments" });
    }
});

router.post("/posts", async (req, res) => {
    const gamertag = req.session.user?.gamertag;
    if (!gamertag || !req.session.user) {
        return res.status(400).send({ message: "Need to be logged in!" });
    }

    const user = await getUserByGamertag(gamertag);
    if (!user) {
        return res.status(404).send({ message: "User was not found" });
    }

    const createdDate = new Date().toISOString().split("T")[0];
    const post = {
        user_id: user.id,
        gamertags: gamertag,
        title: req.body.title,
        content: req.body.content,
        state: "active",
        created_at: createdDate,
        updated_at: createdDate,
    };

    // Store the post in the database
    const query = "INSERT INTO posts SET ?";
    const [result] = await db.query(query, post);

    // Get the ID of the created post
    const postId = result.insertId;
    res.status(201).json({ message: "Comment added successfully", postId });
});

router.post("/comments", async (req, res) => {
    const gamertag = req.session.user?.gamertag;
    if (!gamertag || !req.session.user) {
        return res.status(400).send({ message: "Need to be logged in!" });
    }

    const createdDate = new Date().toISOString().split("T")[0];
    const comment = {
        id: uuidv4(),
        roomId: req.body.roomId,
        content: req.body.content,
        created_at: createdDate,
        gamertag: req.session.user?.gamertag,
    };

    const user = await getUserByGamertag(comment.gamertag);
    const sql = "INSERT INTO comments (post_id, user_id, gamertag, content, created_at) VALUES (?, ?, ?, ?, ?)";
    const values = [comment.roomId, user.id, comment.gamertag, comment.content, createdDate];

    const [rows] = await db.query(sql, values);

    res.status(201).json({ message: "Comment added successfully", comment });
});

export default router;
