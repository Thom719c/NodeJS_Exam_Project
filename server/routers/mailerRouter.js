import dotenv from "dotenv/config";
import nodemailer from "nodemailer";
import { Router } from "express";
const router = Router();

let testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
    },
});
router.post("/contact", async (req, res) => {

    if (req.body && req.body.message !== "") {
        const info = await transporter.sendMail({
            from: `"Contact" ${req.body.email}`,
            to: "example@example.com",
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

export default router;