const Job = require('../../models/jobModel');
const Category = require('../../models/categoryModel');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort('title').populate('category');

    res.render('job', { jobs });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.getAddJob = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');

    res.render('job_add', {
      categories,
    });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.postAddJob = async (req, res) => {
  try {
    await Job.create({
      title: req.body.title,
      recruiter: req.body.recruiter,
      category: req.body.category,
      job_type: req.body.jobType,
      short_description: req.body.shortDesc,
      skill: req.body.skill,
      salary: req.body.salary,
      experience: req.body.experience,
      state: req.body.state,
      city: req.body.city,
    });

    req.flash('green', 'Job added successfully.');
    res.redirect('/job');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.getEditJob = async (req, res) => {
  try {
    const jobs = await Job.findById(req.params.id);
    if (!jobs) {
      req.flash('red', 'Job not found!');
      return res.redirect('/job');
    }
    
    const categories = await Category.find();

    res.render('job_edit', { jobs, categories });
  } catch (error) {
    if (error.name === 'CastError') req.flash('red', 'Job not found!');
    else req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.postEditJob = async (req, res) => {
  try {
    const jobs = await Job.findById(req.params.id);
    if (!jobs) {
      req.flash('red', 'Job not found!');
      return res.redirect('/job');
    }

    jobs.recruiter = req.body.recruiter;
    jobs.title = req.body.title;
    jobs.category = req.body.category;
    jobs.job_type = req.body.job_type;
    jobs.short_description = req.body.short_description;
    jobs.skill = req.body.skill;
    jobs.salary = req.body.salary;
    jobs.experience = req.body.experience;
    jobs.state = req.body.state;
    jobs.city = req.body.city;

    await jobs.save();

    req.flash('green', 'Job edited successfully');
    res.redirect('/job');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.getDeleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    req.flash('green', 'Job deleted successfully.');
    res.redirect('/job');
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'TypeError')
      req.flash('red', 'Job not found!');
    else req.flash('red', error.message);
    res.redirect('/job');
  }
};
