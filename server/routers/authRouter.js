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
import { Router } from "express"
const router = Router();

router.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.status(200).send({});
    })
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

router.put("/reset-password", async (req, res) => {
    const { newPassword, confirmPassword, token } = req.body;

    // Validate the new password
    if (newPassword !== confirmPassword) {
        return res.status(400).send({ message: 'Passwords do not match.' });
    }

    // Check if token is valid
    const data = await getEmailByPasswordResetToken(token);
    if (!data) {
        return res.status(401).send({ message: 'Invalid token.' });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 12);
    // Update the user's password in the database
    await updateUserPassword(encryptedPassword, data.email);
    await deletePasswordResetToken(token);

    res.send({ message: 'Password reset successful.' });
});

export default router