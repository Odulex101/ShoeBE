import express from "express";
import { transporter } from "../controllers/authController.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;

        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL_USER,
            subject: subject || "Customer Care Message",
            html: `
        <h3>Customer Message</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
        });

        res.status(200).json({ message: "Email sent" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Email failed" });
    }
});

export default router;

