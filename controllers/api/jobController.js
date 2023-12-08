const path = require('path');
const Job = require('../../models/jobModel');
const User = require('../../models/userModel');
const AppliedJob = require('../../models/appliedJobModel');

exports.getAllJob = async (req, res, next) => {
  try {
    const query = { isDeleted: false };
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (req.query.city)
      query.city = { $regex: new RegExp(req.query.city, 'i') };

    if (req.query.title)
      query.title = { $regex: new RegExp(req.query.title, 'i') };

    const totalJobCount = await Job.countDocuments(query);

    const job = await Job.find(query)
      .populate('category', 'name')
      .select('-__v -createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      totalJobCount,
      currentPage: page,
      totalPages: Math.ceil(totalJobCount / limit),
      job,
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobByID = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate('category', 'name')
      .select('-__v -createdAt');

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

exports.postResume = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload resume PDF.',
      });
    }

    req.user.resumes.forEach((x) => {
      x.selected = false;
    });

    const newResumes = req.files.map((file) => {
      const resumeTitle = path.parse(file.originalname).name;

      return {
        resumeTitle: req.body.resumeTitle || resumeTitle,
        resumePdf: `/uploads/${file.filename}`,
        selected: true,
      };
    });

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
      resumePdf: req.body.resumePdf,
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
    const appliedJobs = await AppliedJob.find({ isDeleted: false })
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

exports.findByTitle = async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      {
        $match: {
          title: { $regex: new RegExp(req.query.title, 'i') },
        },
      },
      {
        $group: {
          _id: { $toUpper: '$title' },
        },
      },
      {
        $project: {
          _id: 0,
          title: '$_id',
        },
      },
      {
        $limit: 5,
      },
    ]);

    const jobTitle = jobs.map((x) => x.title);

    // const jobs = await Job.distinct('title', {
    //   title: { $regex: new RegExp(req.query.title, 'i') },
    // });

    res.status(200).json(jobTitle);
  } catch (error) {
    next(error);
  }
};

exports.findByCity = async (req, res, next) => {
  try {
    const jobs = await Job.aggregate([
      {
        $match: {
          city: { $regex: new RegExp(req.query.city, 'i') },
        },
      },
      {
        $group: {
          _id: { $toUpper: '$city' },
        },
      },
      {
        $project: {
          _id: 0,
          city: '$_id',
        },
      },
      {
        $limit: 5,
      },
    ]);

    const jobCity = jobs.map((x) => x.city);

    res.status(200).json(jobCity);
  } catch (error) {
    next(error);
  }
};

exports.popularJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ popular: -1, updatedAt: -1 }).limit(3);

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};