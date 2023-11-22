const router = require('express').Router();

const userController = require('../../controllers/admin/userController');

// user
router.get('/user', userController.getAllUsers);
router.get("/user/:id", userController.viewUser);

// message
router.get('/message', userController.getAllMessages);

router.get('/message_view/:id', userController.viewMessages);

module.exports = router;
