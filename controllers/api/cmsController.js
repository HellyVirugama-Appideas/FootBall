const createError = require("http-errors");

const Page = require("../../models/pageModel");
const Newsletter = require("../../models/newsletterModel");
const Banner = require("../../models/bannerModel");
const Featured = require("../../models/featuredModel");
const Contact = require("../../models/contactModel");

exports.getAbout = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: "about" }).select("-__v -key -_id");

    res.json({ success : true, page });
  } catch (error) {
    next(error);
  }
};

exports.getPrivacy = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: "privacy" }).select("-__v -key -_id");

    res.json({ success : true, page });
  } catch (error) {
    next(error);
  }
};

exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne().select("-_id -__v -mailList");
    res.json({ success : true, contact });
  } catch (error) {
    next(error);
  }
};

exports.postContact = async (req, res, next) => {
  try {
    await Message.create(req.body);
    res.status(201).json({ success : true, message: "msg" });
  } catch (error) {
    next(error);
  }
};

exports.newsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    const emailExist = await Newsletter.findOne({ email });
    if (emailExist) return next(createError.BadRequest("newsletter.already"));

    await Newsletter.create({ email });

    res.status(201).json({
      success : true,
      message: "newsletter.success",
    });
  } catch (error) {
    next(error);
  }
};

exports.getBanners = async (req, res, next) => {
  try {
    let [banners, featured] = await Promise.all([
      Banner.find().sort("sort -_id").select("-_id -__v -name -sort"),
      Featured.find().sort("sort -_id").select("-_id -__v -name -sort"),
    ]);

    res.json({
      success : true,
      banners,
      featured,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFooterLinks = async (req, res, next) => {
  try {
    let pages = await Page.find().select("en.title es.title url -_id");

    res.json({ success : true, pages });
  } catch (error) {
    next(error);
  }
};