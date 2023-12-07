const router = require('express').Router();

const { checkUser } = require('../../controllers/api/authController');
const dashboardController = require('../../controllers/api/dashboardController');

router
  .route('/profile')
  .get(checkUser, dashboardController.getProfile)
  .put(checkUser, dashboardController.editProfile);

router.post('/change-password', checkUser, dashboardController.changePassword);

module.exports = router;
