import dotenv from "dotenv/config";
import nodemailer from "nodemailer";
import { getUserByEmail, createPasswordResetTokenInDB, updateUserPassword, deletePasswordResetToken } from "../database/userQueries.js";
import { Router } from "express";
const router = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODERMAILER_EMAIL,
        pass: process.env.NODERMAILER_PSWD
    }
});

router.post("/mail/contact", async (req, res) => {
    if (req.body && req.body.message !== "") {
        const info = await transporter.sendMail({
            from: `"Feedback" ${req.body.email}`,
            to: "nodejskeatp@gmail.com",
            subject: req.body.subject,
            text: req.body.message
        });
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.status(200)
            .send({ message: "Your feedback is sent: " + req.body.message });
    } else {
        res.status(404)
            .send({ message: "No data: " + req.body });
    }
});

// TODO Forgot password send mail with token and url to reset password
router.post("/mail/forgot-password", async (req, res) => {
    const email = req.body.email;

    // Check if a user with the given email exists
    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(400).json({ message: "No user with that email exists" });
    }

    // Save the token and user's email in the database
    const token = await createPasswordResetTokenInDB(email);

    // Send the password reset email
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    const info = await transporter.sendMail({
        from: '"Gaming Oasis - Password Service" <nodejskeatp@gmail.com>',
        to: email,
        subject: "Change of Password",
        html: `
            <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
            <p>If this is not you, you should ignore this e-mail.</p>
            <br>
            <p>Please click the following link to complete the process:</p>
            <a href="${resetUrl}">Link</a>
            <p>This link will expire in 1 hour.</p>
        `
    });

    if (info.messageId) {
        res.status(200).send({ message: "Email has been send to your account" });
    }
});

export default router;