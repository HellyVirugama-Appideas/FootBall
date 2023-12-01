const Job = require('../../models/jobModel');
const User = require('../../models/userModel');
const AppliedJob = require('../../models/appliedJobModel');

exports.getAllJob = async (req, res, next) => {
  try {
    const job = await Job.find().populate('category', 'name').select('-__v');

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobByID = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('category', 'name')
      .select('-__v');

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

exports.postResume = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload resume PDFs.',
      });
    }

    req.user.resumes.forEach((x) => {
      x.selected = false;
    });

    const newResumes = req.files.map((file) => ({
      resumeTitle: req.body.resumeTitle,
      resumePdf: process.env.BASE_URL + `/uploads/${file.filename}`,
      selected: true,
    }));

    req.user.resumes = req.user.resumes.concat(newResumes);
    await req.user.save();

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('resumes.resumeTitle resumes.resumePdf resumes.selected')
      .lean();

    res.json({
      success: true,
      resumes: user.resumes,
    });
  } catch (error) {
    next(error);
  }
};

exports.selectResume = async (req, res, next) => {
  try {
    req.user.resumes.forEach((x) => {
      x.selected = x.id === req.params.id ? true : false;
    });
    await req.user.save();
    res.json({
      success: true,
      message: 'Resume selected successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { resumes: { _id: req.params.id } } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (updatedUser.resumes.length > 0) {
      updatedUser.resumes[0].selected = true;
    }

    await updatedUser.save();
    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    const existingApplication = await AppliedJob.findOne({
      user_id: req.user._id,
      job_id: req.params.jobId,
    });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'User has already applied for this job',
      });
    }

    const appliedJob = new AppliedJob({
      user_id: req.user.id,
      job_id: req.params.jobId,
    });

    await appliedJob.save();

    res.json({
      success: true,
      message: 'Applied for the job successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getAppliedJob = async (req, res, next) => {
  try {
    const appliedJobs = await AppliedJob.find()
      .populate({
        path: 'job_id',
        populate: {
          path: 'category',
          model: 'Category',
        },
      })
      .select({ createdAt: 0, __v: 0, user_id: 0 })
      .exec();

    res.json({
      success: true,
      appliedJobs,
    });
  } catch (error) {
    next(error);
  }
};
