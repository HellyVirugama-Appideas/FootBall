const router = require('express').Router();

const { checkUser } = require('../../controllers/api/authController');
const jobController = require('../../controllers/api/jobController');
const { uploadPDF } = require('../../controllers/uploadController');

router.get('/all-job', jobController.getAllJob);
router.get('/job/:id', jobController.getJobByID);
router
  .route('/resume')
  .post(checkUser, uploadPDF.single('pdf'), jobController.postResume);

module.exports = router;
