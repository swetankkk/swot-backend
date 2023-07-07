const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.post(
	'/register',
	validate(authValidation.register),
	authController.register
);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post(
	'/refresh-tokens',
	validate(authValidation.refreshTokens),
	authController.refreshTokens
);
//router.post("/forgot-password", authController.forgotPassword);
router.post(
	'/reset-password',
	validate(authValidation.resetPassword),
	authController.resetPassword
);
//router.post("/send-verification-email", authController.resendVerificationEmail);
//router.post("/verify-email", authController.verifyEmail);

//To be added router.post('/logout-all',auth(),authController.logoutAll)

router
	.route('/getswots')
	.get(auth(), authController.getSwots)
	.post(auth(), authController.getSwots);

router
	.route('/indivisualswot')
	.get(auth(), authController.getSwot)
	.patch(auth(), authController.modifySwot);

module.exports = router;
