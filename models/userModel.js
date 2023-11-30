const mongoose = require('mongoose');
const validator = require('validator');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validate = require('../utils/validation.json');

const userSchema = new mongoose.Schema({
  fname: { type: String, required: [true, validate.fname], trim: true },
  lname: { type: String, required: [true, validate.lname], trim: true },
  email: {
    type: String,
    required: [true, validate.email],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, validate.emailInvalid],
  },
  password: {
    type: String,
    required: [true, validate.password],
    minlength: [6, 'Password should be atleast 6 characters long.'],
    trim: true,
    select: false,
  },
  resumeTitle: { type: String, trim: true },
  resumePdf: { type: String },
  city: { type: String, trim: true, required: [true, validate.city] },
  state: { type: String, trim: true, required: [true, validate.state] },
  country: {
    type: String,
    trim: true,
    required: [true, validate.country],
    default: 'United States',
  },
  date: { type: Date, default: Date.now },
});

// Generating tokens
userSchema.methods.generateAuthToken = function () {
  try {
    return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '90d',
    });
  } catch (error) {
    throw createError.BadRequest(error);
  }
};

// Converting password into hash
userSchema.post('validate', async function (doc) {
  if (doc.isModified('password')) {
    if (doc.password) doc.password = await bcrypt.hash(doc.password, 10);
  }
});

// check password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = new mongoose.model('User', userSchema);
