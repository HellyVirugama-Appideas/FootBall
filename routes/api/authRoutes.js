const router = require('express').Router();
const fileUpload = require('express-fileupload');

const authController = require('../../controllers/api/authController');

router.post('/register', fileUpload(), authController.register);

router.post('/login', fileUpload(), authController.login);

router.post('/forgot-password', fileUpload(), authController.forgotPassword);

router.post('/reset-password', fileUpload(), authController.resetPassword);

module.exports = router;
