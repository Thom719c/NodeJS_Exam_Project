import db from "../database/connection.js";
import { getUserByGamertag, removePost, removeComment } from "../database/userQueries.js";

import { Router } from "express"    
const router = Router();

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

        res.status(200).send({ message: "Post and comments.", data: postData });
    } catch (error) {
        res.status(500).send({ message: "Failed to retrieve post and comments." });
    }
});

router.post("/posts", async (req, res) => {
    const gamertag = req.session.user?.gamertag;
    if (!gamertag || !req.session.user) {
        return res.status(400).send({ message: "Need to be logged in!" });
    }

    if (!req.body.title || !req.body.content) {
        return res.status(404).send({ message: "Both title and content fields are required." });
    }

    const user = await getUserByGamertag(gamertag);
    if (!user) {
        return res.status(404).send({ message: "User was not found." });
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
    const [rows] = await db.query(query, post);

    // Get the ID of the created post
    const postId = rows.insertId;
    res.status(201).send({ message: "Your post has been added successfully.", postId });
});

router.post("/comments", async (req, res) => {
    const gamertag = req.session.user?.gamertag;
    if (!gamertag || !req.session.user) {
        return res.status(400).send({ message: "Need to be logged in!" });
    }

    if (!req.body.content) {
        return res.status(404).send({ message: "The comment content cannot be empty." });
    }

    const createdDate = new Date().toISOString().split("T")[0];

    const user = await getUserByGamertag(gamertag);
    const query = "INSERT INTO comments (post_id, user_id, gamertag, content, created_at) VALUES (?, ?, ?, ?, ?)";
    const values = [req.body.roomId, user.id, gamertag, req.body.content, createdDate];

    const [rows] = await db.query(query, values);

    const comment = {
        id: rows.insertId,
        roomId: req.body.roomId,
        content: req.body.content,
        created_at: createdDate,
        gamertag: gamertag,
    };

    res.status(201).send({ message: "Comment added successfully.", comment });
});

router.patch("/comments", async (req, res) => {
    const gamertag = req.session.user?.gamertag;
    if (!gamertag || !req.session.user) {
        return res.status(400).send({ message: "Need to be logged in!" });
    }
    
    if (!req.body.content) {
        return res.status(404).send({ message: "The comment content cannot be empty." });
    }
    
    const query = "UPDATE comments SET content = ? WHERE id = ?;";    
    const values = [req.body.content, req.body.id];

    await db.query(query, values);

    res.status(201).send({ message: "Comment edited successfully." });
});

router.delete("/posts/:id", async (req, res) => {
    const postId = req.params.id;
    const postTitle = req.body.title

    if (!req.session.user?.gamertag || !postTitle) {
        return res.status(400).send({ message: "Missing the keys in the body or not logged in, if is logged in try login again." });
    }

    await removePost(req.session.user.gamertag, postId);

    res.status(201).send({ message:'Your post: ' + postTitle + ' was removed successfully from communityHub' });
})

router.delete("/comments/:id", async (req, res) => {
    const postId = req.params.id;
    const commentId = req.body.id;

    if (!req.session.user?.gamertag || !commentId) {
        return res.status(400).send({ message: "Missing the keys in the body or not logged in, if is logged in try login again." });
    }

    await removeComment(req.session.user.gamertag, postId, commentId);

    res.status(201).send({ message:'Your comment was removed successfully from communityHub' });
})

export default router;