const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

router.post('/login', validate(authValidation.login), authController.login);
// google login
router.post('/google', authController.GoogleLogin)

router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/change-password', auth('common'),validate(authValidation.changePassword), authController.changePassword);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/delete-me',auth('user'),validate(authValidation.deleteMe),authController.deleteMe);

module.exports = router;

