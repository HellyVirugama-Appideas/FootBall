const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
  },
  job_type: {
    type: String,
    required: [true, 'Job type is required.'],
    trim: true,
  },
  details: {
    type: String,
    required: [true, 'Job details is required.'],
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
  state: {
    type: String,
    required: [true, 'State name is required.'],
    trim: true,
  },
});

module.exports = mongoose.model('Job', JobSchema);
