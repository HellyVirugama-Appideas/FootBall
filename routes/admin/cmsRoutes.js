const router = require('express').Router();

const cmsController = require('../../controllers/admin/cmsController');
const { upload } = require('../../controllers/uploadController');

router
    .route('/contact')
    .get(cmsController.getContact)
    .post(cmsController.postContact);

router
    .route('/about')
    .get(cmsController.getAbout)
    .post(upload.single('image'), cmsController.postAbout);

router
    .route('/privacy')
    .get(cmsController.getPrivacy)
    .post(upload.single('image'), cmsController.postPrivacy);

module.exports = router;
