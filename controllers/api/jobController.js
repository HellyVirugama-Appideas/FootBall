const Job = require('../../models/jobModel');
const User = require('../../models/userModel');

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
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume PDF.',
      });
    }
    const user = await User.findById(req.user.id);

    user.resumePdf = req.file ? `/uploads/${req.file.filename}` : undefined;
    user.resumeTitle = req.body.resumeTitle;

    await user.save();

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
