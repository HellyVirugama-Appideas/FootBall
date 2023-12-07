const router = require('express').Router();

const cmsController = require('../../controllers/api/cmsController');

router.get('/about', cmsController.getAbout);

router.get('/whoWeAre', cmsController.getWhoWeAre);

router.get('/privacy', cmsController.getPrivacy);

router
  .route('/contact')
  .get(cmsController.getContact)
  .post(cmsController.postContact);

router.post('/newsletter', cmsController.newsletter);

router.get('/banner', cmsController.getBanners);

router.get('/faqs', cmsController.getFAQs);

router.get('/testimonial', cmsController.getTestimonial);

router.get('/terms', cmsController.getTermsCondition);

module.exports = router;
