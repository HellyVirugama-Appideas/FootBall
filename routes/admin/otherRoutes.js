const router = require("express").Router();

const otherController = require("../../controllers/admin/otherController");
const {
  upload,
  uploadMedia,
  uploadVideo,
} = require("../../controllers/uploadController");

// banner
router.get("/banner", otherController.getBanners);

router
  .route("/banner")
  .post(uploadVideo.single("video"), otherController.postAddBanner);

// newsletter
router.get("/newsletter", otherController.getNewsletterList);
router.get("/newsletter/export", otherController.getNewsletterExport);

// media
router
  .route("/media")
  .get(otherController.getMedia)
  .post(uploadMedia.array("image"), otherController.postMedia);

module.exports = router;
