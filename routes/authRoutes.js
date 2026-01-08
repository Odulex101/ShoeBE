import express from "express";
import {
    sendLoginCode,
    verifyCode,
    checkEmail
} from "../controllers/authController.js";
import { startRegistration } from "../controllers/authController.js";


const router = express.Router();

// 🔍 CHECK IF EMAIL EXISTS (FRONTEND REQUIRES THIS)
router.post("/check-email", checkEmail);

router.post("/register", startRegistration);

// ✉️ SEND VERIFICATION CODE
router.post("/send-code", sendLoginCode);

// ✅ VERIFY CODE & RETURN JWT
router.post("/verify-code", verifyCode);

export default router;

