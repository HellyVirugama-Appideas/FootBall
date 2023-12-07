const router = require('express').Router();
const fileUpload = require('express-fileupload');

const authController = require('../../controllers/api/authController');

router.post('/register', fileUpload(), authController.register);

router.post('/login', fileUpload(), authController.login);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

module.exports = router;
