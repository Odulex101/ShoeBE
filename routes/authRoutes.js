// import express from "express";
// import {
//     sendLoginCode,
//     verifyCode,
//     checkEmail
// } from "../controllers/authController.js";
// import { startRegistration } from "../controllers/authController.js";


// const router = express.Router();

// // 🔍 CHECK IF EMAIL EXISTS (FRONTEND REQUIRES THIS)
// router.post("/check-email", checkEmail);

// router.post("/register", startRegistration);

// // ✉️ SEND VERIFICATION CODE
// router.post("/send-code", sendLoginCode);

// // ✅ VERIFY CODE & RETURN JWT
// router.post("/verify-code", verifyCode);

// export default router;


import express from "express";
import {
    checkEmail,
    startRegistration,
    sendLoginCode,
    verifyCode,
    setPassword,
    login
} from "../controllers/authController.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTES (no auth required)
// ============================================

// 1️⃣ Check if email exists (login or start registration)
router.post("/check-email", checkEmail);

// 2️⃣ Start registration (shop users only)
router.post("/register", startRegistration);

// 3️⃣ Send login/verification code to email
router.post("/send-code", sendLoginCode);

// 4️⃣ Verify code entered by user
router.post("/verify-code", verifyCode);

// 5️⃣ Set password for new user after verification
router.post("/set-password", setPassword);

router.post("/login", login);


export default router;



