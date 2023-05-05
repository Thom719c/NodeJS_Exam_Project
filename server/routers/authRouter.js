import { Router } from "express"
const router = Router();
import bcrypt from "bcrypt"
import { getUserByEmail, getUserByUsername, checkIfUserExist, create, update, updateUserPassword, getEmailByPasswordResetToken, deletePasswordResetToken } from "../database/userQueries.js";


router.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.status(200).send({});
    })
});

//Route for testing purposes...
router.get("/allUsers", async (req, res) => {
    const users = await db.all("SELECT * FROM users");
    res.send({ data: users })
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Missing the keys (email and password) in the body" })
    }

    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(404).send({ message: "User was not found" })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(404).send({ message: "Email or password did not match" })
    }
    req.session.user = {
        username: user.username,
        name: user.name,
        email: user.email
    }
    res.send({ session: req.session, message: "Login successful" });
});

router.post("/signup", async (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
        return res.status(400).send({ message: "Missing the keys (email and password) in the body" })
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

export default router