const router = require('express').Router();

const jobController = require('../../controllers/admin/jobController');

router.get('/job', jobController.getJobs);
router
  .route('/job/add')
  .get(jobController.getAddJob)
  .post(jobController.postAddJob);
router
  .route('/job/edit/:id')
  .get(jobController.getEditJob)
  .post(jobController.postEditJob);
router.get('/job/delete/:id', jobController.getDeleteJob);

module.exports = router;
