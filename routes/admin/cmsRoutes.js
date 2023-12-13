const router = require('express').Router();

const cmsController = require('../../controllers/admin/cmsController');
const { upload } = require('../../controllers/uploadController');

router
  .route('/about')
  .get(cmsController.getAbout)
  .post(upload.single('image'), cmsController.postAbout);

router
  .route('/whoWeAre')
  .get(cmsController.getWhoWeAre)
  .post(upload.single('image'), cmsController.postWhoWeAre);

router
  .route('/privacy')
  .get(cmsController.getPrivacy)
  .post(upload.single('image'), cmsController.postPrivacy);

router.get('/faqs', cmsController.getFAQs);
router
  .route('/faqs/add')
  .get(cmsController.getAddFAQ)
  .post(cmsController.postAddFAQ);
router
  .route('/faqs/edit/:id')
  .get(cmsController.getEditFAQ)
  .post(cmsController.postEditFAQ);
router.get('/faqs/delete/:id', cmsController.getdeleteFAQ);

router
  .route('/terms')
  .get(cmsController.getTermsCondi)
  .post(upload.single('image'), cmsController.postTermsCondi);

module.exports = router;
