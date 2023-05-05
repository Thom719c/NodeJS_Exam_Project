import dotenv from "dotenv/config";
import nodemailer from "nodemailer";
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

router.post("/contact", async (req, res) => {
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
router.post("/forgot-password", async (req, res) => {
    const email = req.body.email;

    // Check if a user with the given email exists

    // Save the token and user's email in the database

    // Send the password reset email
    
});

export default router;