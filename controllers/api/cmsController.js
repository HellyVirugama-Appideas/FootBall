const createError = require('http-errors');

const Page = require('../../models/pageModel');
const Newsletter = require('../../models/newsletterModel');
const Banner = require('../../models/bannerModel');
const Contact = require('../../models/contactModel');
const Message = require('../../models/messageModel');
const FAQs = require('../../models/faqsModel');
const Testimonial = require('../../models/testimonialModel');
const validator = require('../../utils/validation.json');

exports.getAbout = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: 'about' }).select('-__v -key -_id');

    res.json({ success: true, page });
  } catch (error) {
    next(error);
  }
};

exports.getWhoWeAre = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: 'whoWeAre' }).select('-__v -key -_id');

    res.json({ success: true, page });
  } catch (error) {
    next(error);
  }
};

exports.getPrivacy = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: 'privacy' }).select(
      '-__v -key -_id -createdAt -updatedAt'
    );

    res.json({ success: true, page });
  } catch (error) {
    next(error);
  }
};

exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne().select('-_id -__v -mailList');
    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

exports.postContact = async (req, res, next) => {
  try {
    await Message.create(req.body);
    res
      .status(201)
      .json({ success: true, message: 'Message send successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.newsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    const emailExist = await Newsletter.findOne({ email });
    if (emailExist)
      return next(createError.BadRequest(validator.alreadyRegistered));

    await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: validator.msg,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBanners = async (req, res, next) => {
  try {
    const banner = await Banner.findOne().select('-__v -_id');

    res.json({
      success: true,
      banner,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQs.find().sort('-_id').select('-_id -__v');

    res.json({ success: true, content: faqs });
  } catch (error) {
    next(error);
  }
};

exports.getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.find()
      .sort('-_id')
      .select('-_id -__v -updatedAt -createdAt');

    res.json({ success: true, testimonial });
  } catch (error) {
    next(error);
  }
};

exports.getTermsCondition = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: 'termsConditions' }).select(
      '-__v -key -_id -createdAt -updatedAt'
    );

    res.json({ success: true, page });
  } catch (error) {
    next(error);
  }
};
