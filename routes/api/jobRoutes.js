const router = require('express').Router();
const fileUpload = require('express-fileupload');

const { checkUser } = require('../../controllers/api/authController');
const jobController = require('../../controllers/api/jobController');
const { uploadPDF } = require('../../controllers/uploadController');

router.get('/all-job', jobController.getJobList);
router.get('/job/:id', jobController.getJobByID);

router.get('/apply/job/:id', jobController.getAppliedJob);
router.post(
  '/apply/job/:jobId',
  fileUpload(),
  checkUser,
  jobController.applyForJob
);

router.get('/resume', checkUser, jobController.getResume);
router.get('/select/resume/:id', checkUser, jobController.selectResume);
router.route('/resume').post(checkUser, uploadPDF, jobController.postResume);
router.get('/resume/:id', checkUser, jobController.deleteResume);

router.get('/autocomplete/title', jobController.findByTitle);
router.get('/autocomplete/city', jobController.findByCity);
router.get('/all/jobs', jobController.popularJobs);

module.exports = router;
