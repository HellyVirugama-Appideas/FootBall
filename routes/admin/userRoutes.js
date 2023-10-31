const router = require('express').Router();

const userController = require('../../controllers/admin/userController');
const { uploadCSV } = require('../../controllers/uploadController');

// user
router.get('/user', userController.getAllUsers);

router.get('/user/block/:id', userController.blockUser);

router.get('/user/unblock/:id', userController.unblockUser);

module.exports = router;
