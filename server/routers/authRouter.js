import { Router } from "express"
const router = Router();
import db from "../databases/connection.js";
import bcrypt from "bcrypt"

router.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.status(200).send({});
    })
    
});

router.get("/allUsers", async (req, res) => {
    const users = await db.all("SELECT * FROM users");
    res.send({ data: users })
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Missing the keys (email and password) in the body" })
    }
    const user = await db.get("SELECT * FROM users WHERE email = ?;", [email]);
    if (!user) {
        return res.status(404).send({ message: "User was not found" })
    } 

    const isSame = await bcrypt.compare(password, user.password);
    if (!isSame) {
        return res.status(404).send({ message: "Email or password did not match" })
    }
    req.session.user = {
        user_name: user.user_name,
        name: user.name,
        email: user.email
    }
    res.send({data: user, session: req.session, message: "Login successful"});
});

router.post("/signUp", async (req, res) => {
    const userData = req.body;
    if (!userData.email || !userData.password) {
        return res.status(400).send({ message: "Missing the keys (email and password) in the body" })
    }
    const encryptedPassword = await bcrypt.hash(userData.password, 12);

    const user = await db.run("INSERT INTO users (user_name, name, email, password) VALUES (?, ?, ?, ?)", [userData.user_name, userData.name, userData.email, encryptedPassword]) 
    res.status(201).send({data: user, message: "User Created"});
});

export default router