const router = require('express').Router();

const cmsController = require('../../controllers/api/cmsController');

router.get('/about', cmsController.getAbout);

router.get('/privacy', cmsController.getPrivacy);

router
    .route('/contact')
    .get(cmsController.getContact)
    .post(cmsController.postContact);

router.post('/newsletter', cmsController.newsletter);

router.get('/banner', cmsController.getBanners);

router.get('/footer-links', cmsController.getFooterLinks);

router.get("/faqs", cmsController.getFAQs);

module.exports = router;
