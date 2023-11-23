const router = require('express').Router();

const otherController = require('../../controllers/admin/otherController');
const {
  upload,
  uploadMedia,
  uploadVideo,
} = require('../../controllers/uploadController');

// banner
router.get('/banner', otherController.getBanners);
router
  .route('/banner')
  .post(uploadVideo.single('video'), otherController.postAddBanner);

// newsletter
router.get('/newsletter', otherController.getNewsletterList);
router.get('/newsletter/export', otherController.getNewsletterExport);

// testimonial
router.get('/testimonial', otherController.getTestimonial);
router
  .route('/testimonial/add')
  .get(otherController.getAddTestimonial)
  .post(upload.single('image'), otherController.postAddTestimonial);
router
  .route('/testimonial/edit/:id')
  .get(otherController.getEditTestimonial)
  .post(upload.single('image'), otherController.postEditTestimonial);
router.get('/testimonial/delete/:id', otherController.getDeleteTestimonial);

// media
router
  .route('/media')
  .get(otherController.getMedia)
  .post(uploadMedia.array('image'), otherController.postMedia);

module.exports = router;
