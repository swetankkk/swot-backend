const express = require("express");
//const validate = require("../../middlewares/validate");
const authController = require("../../controllers/auth.controller");
//const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/register", authController.register);
//router.post("/login", authController.login);
//router.post("/logout", authController.logout);
//router.post("/refresh-tokens", authController.refreshTokens);
//router.post("/forgot-password", authController.forgotPassword);
//router.post("/reset-password", authController.resetPassword);
//router.post("/send-verification-email", authController.resendVerificationEmail);
//router.post("/verify-email", authController.verifyEmail);

//To be added router.post('/logout-all',auth(),authController.logoutAll)

module.exports = router;
