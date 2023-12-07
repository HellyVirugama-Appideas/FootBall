const mongoose = require('mongoose');

const JobSchema = mongoose.Schema(
  {
    recruiter: {
      type: String,
      required: [true, 'Recruiter is required.'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    job_type: {
      type: String,
      required: [true, 'Job type is required.'],
      trim: true,
    },
    short_description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
    },
    skill: {
      type: String,
      required: [true, 'Skill is required.'],
      trim: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary range is required.'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience is required.'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country name is required.'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State name is required.'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City name is required.'],
      trim: true,
    },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', JobSchema);
