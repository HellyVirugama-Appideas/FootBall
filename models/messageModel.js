const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required.'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required.'],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', MessageSchema);
