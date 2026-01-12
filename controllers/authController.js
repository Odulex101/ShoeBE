import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

/* =============================== EMAIL TRANSPORTER =============================== */
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // MUST BE APP PASSWORD
    },
});

transporter.verify((err) => {
    if (err) {
        console.error("❌ Email server error:", err.message);
    } else {
        console.log("✅ Email server ready");
    }
});

/* =============================== OTP EMAIL TEMPLATE =============================== */
export const otpEmailTemplate = (code) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your One-Time Password</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f7fa; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fa; padding:20px;">
      <tr>
        <td align="center">
          <!-- Card -->
          <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
              <td style="background:#000000; padding:16px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:20px; letter-spacing:1px;">
                  TEMORAH <span style="color:#38bdf8;">DESIGNS</span>
                </h1>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:30px; text-align:center; color:#000000;">
                <h2 style="margin:0 0 10px; font-size:18px;">Your One-Time Password</h2>
                <p style="margin:0 0 25px; font-size:14px; color:#555;">
                  Use the OTP below to continue. This code is valid for a limited time.
                </p>
                <!-- OTP Code -->
                <div style="
                  display:inline-block;
                  background:#f0f9ff;
                  color:#dc2626;
                  font-size:28px;
                  font-weight:bold;
                  letter-spacing:6px;
                  padding:14px 24px;
                  border-radius:6px;
                  border:1px solid #38bdf8;
                ">
                  ${code}
                </div>
                <p style="margin:20px 0 0; font-size:13px; color:#444;">
                  ⏳ Expires in <strong>10 minutes</strong>
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc; padding:15px; text-align:center; font-size:12px; color:#666;">
                If you did not request this code, please ignore this email.
                <br />
                <span style="color:#38bdf8;">© ${new Date().getFullYear()} Temorah Designs</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

/* =============================== CHECK EMAIL (EXISTING USER LOGIN) =============================== */
export const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ status: false, message: "Email required" });
        }

        const user = await User.findOne({ email });

        // 🆕 EMAIL NOT REGISTERED
        if (!user) {
            return res.status(200).json({
                status: false,
                message: "Email not registered",
                exists: false,
            });
        }

        // ⛔ EXISTS BUT NOT VERIFIED → FORCE REGISTRATION
        if (!user.verified) {
            return res.status(400).json({
                status: false,
                exists: false,
                needsVerification: true,
                message: "Email not verified. Please complete registration.",
            });
        }

        // ✅ VERIFIED USER → LOGIN
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            exists: true,
            status: true,
            message: "Sign in successful",
            token,
        });
    } catch (err) {
        console.error("checkEmail error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* =============================== START REGISTRATION (SHOP ONLY) =============================== */
export const startRegistration = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        await User.create({ email, verified: false });

        res.status(201).json({ message: "Registration started" });
    } catch (err) {
        console.error("startRegistration error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/* =============================== SEND LOGIN CODE (NEW USERS) =============================== */
export const sendLoginCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const user = await User.findOne({ email });

        // ⛔ BLOCK UNREGISTERED USERS
        if (!user) {
            return res.status(403).json({
                message: "Email not registered. Please sign up first.",
            });
        }

        // ⛔ BLOCK VERIFIED USERS (THEY SHOULD LOGIN DIRECTLY)
        if (user.verified) {
            return res.status(400).json({
                message: "Account already verified. Please log in.",
            });
        }

        const code = crypto.randomInt(100000, 999999).toString();

        user.verificationCode = code;
        user.codeExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        if (process.env.NODE_ENV !== "production") {
            console.log(`🔐 OTP for ${email}: ${code}`);
        }

        await transporter.sendMail({
            from: `"Temorah Login" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your verification code",
            html: otpEmailTemplate(code),
        });

        res.status(200).json({ message: "Verification code sent" });
    } catch (error) {
        console.error("sendLoginCode error:", error);
        res.status(500).json({ message: "Failed to send code" });
    }
};

/* =============================== VERIFY CODE =============================== */
export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Email & code required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(404)
                .json({ status: false, message: "User not found" });
        }

        if (user.verificationCode !== code || Date.now() > user.codeExpires) {
            return res
                .status(400)
                .json({ message: "Invalid or expired code" });
        }

        user.verificationCode = null;
        user.codeExpires = null;
        user.verified = true;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            status: true,
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("verifyCode error:", error);
        res.status(500).json({ message: "Verification failed" });
    }
};












