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
    .route('/shipping-freight')
    .get(cmsController.getShippingFreight)
    .post(upload.single('image'), cmsController.postShippingFreight);

router
    .route('/privacy')
    .get(cmsController.getPrivacy)
    .post(upload.single('image'), cmsController.postPrivacy);

router
    .route('/special-orders')
    .get(cmsController.getSpecialOrders)
    .post(upload.single('image'), cmsController.postSpecialOrders);

module.exports = router;
