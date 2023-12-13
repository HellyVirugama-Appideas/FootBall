const path = require('path');
const Job = require('../../models/jobModel');
const User = require('../../models/userModel');
const AppliedJob = require('../../models/appliedJobModel');
const Category = require('../../models/categoryModel');

exports.getJobList = async (req, res, next) => {
  try {
    const query = { isDeleted: false };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (req.query.city)
      query.city = { $regex: new RegExp(req.query.city, 'i') };

    if (req.query.title)
      query.title = { $regex: new RegExp(req.query.title, 'i') };

    if (req.query.category) query.category = { $in: req.query.category };

    if (req.query.jobType) query.job_type = req.query.jobType;

    if (req.query.workPlace) query.work_place = req.query.workPlace;

    if (req.query.minSalary || req.query.maxSalary) {
      const salaryQuery = {};
      if (req.query.minSalary) salaryQuery.$gte = parseInt(req.query.minSalary);
      if (req.query.maxSalary) salaryQuery.$lte = parseInt(req.query.maxSalary);
      query.salary = salaryQuery;
    }
    const totalJobCount = await Job.countDocuments(query);

    const job = await Job.find(query)
      .populate('category recruiter', '-__v -createdAt -updatedAt')
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
      .populate('category recruiter', '-__v -createdAt -updatedAt')
      .select('-__v -createdAt');

    const filter = {
      $or: [
        { category: job.category },
        { title: { $regex: new RegExp(job.title, 'i') } },
        { city: { $regex: new RegExp(job.city, 'i') } },
      ],
      _id: { $ne: job._id },
      isDeleted: false,
    };

    const similarJobs = await Job.find(filter)
      .populate('category recruiter', '-__v -createdAt -updatedAt')
      .limit(3)
      .select('-__v -createdAt');

    res.json({
      success: true,
      job,
      similarJobs,
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
    const user = await User.findById(req.user.id);

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

exports.getAppliedJobs = async (req, res, next) => {
  try {
    const appliedJobs = await AppliedJob.find({
      user_id: req.user.id,
    })
      .populate({
        path: 'job_id',
        populate: [
          {
            path: 'category',
            model: 'Category',
          },
          {
            path: 'recruiter',
            model: 'Recruiter',
          },
        ],
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
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: { $toLower: '$title' },
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

    const jobTitle = jobs.map((x) => {
      const titleWords = x.title
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
      const titleCase = titleWords.join(' ');
      return titleCase;
    });

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
          isDeleted: false,
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

    const jobCity = jobs.map((x) => {
      const cityWords = x.city
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
      const titleCase = cityWords.join(' ');
      return titleCase;
    });

    res.status(200).json(jobCity);
  } catch (error) {
    next(error);
  }
};

exports.popularJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isDeleted: false })
      .populate('category recruiter', '-__v -createdAt -updatedAt')
      .sort({ popular: -1, updatedAt: -1 })
      .limit(3);

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryList = async (req, res, next) => {
  try {
    const data = await Category.find().select('-__v');

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
