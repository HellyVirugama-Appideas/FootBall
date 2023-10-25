const router = require('express').Router();

const otherController = require('../../controllers/admin/otherController');
const { upload, uploadMedia } = require('../../controllers/uploadController');

// banner
router.get('/banner', otherController.getBanners);
router
    .route('/banner/add')
    .get(otherController.getAddBanner)
    .post(upload.single('image'), otherController.postAddBanner);
router
    .route('/banner/edit/:id')
    .get(otherController.getEditBanner)
    .post(upload.single('image'), otherController.postEditBanner);
router.get('/banner/delete/:id', otherController.getDeleteBanner);
router.post('/banner/sort', otherController.sortBanners);

// featured
router.get('/featured', otherController.getFeatured);
router
    .route('/featured/add')
    .get(otherController.getAddFeatured)
    .post(upload.single('image'), otherController.postAddFeatured);
router
    .route('/featured/edit/:id')
    .get(otherController.getEditFeatured)
    .post(upload.single('image'), otherController.postEditFeatured);
router.get('/featured/delete/:id', otherController.getDeleteFeatured);
router.post('/featured/sort', otherController.sortFeatured);

// newsletter
router.get('/newsletter', otherController.getNewsletterList);

router.get('/newsletter/export', otherController.getNewsletterExport);

// config
router
    .route('/config')
    .get(otherController.getConfig)
    .post(otherController.postConfig);

// media
router
    .route('/media')
    .get(otherController.getMedia)
    .post(uploadMedia.array('image'), otherController.postMedia);

module.exports = router;
