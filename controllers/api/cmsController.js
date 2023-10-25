const createError = require("http-errors");
const multilingual = require("../../utils/multilingual");

const Page = require("../../models/pageModel");
const Message = require("../../models/messageModel");
const Newsletter = require("../../models/newsletterModel");
const Banner = require("../../models/bannerModel");
const Featured = require("../../models/featuredModel");
const Config = require("../../models/configModel");
const Contact = require("../../models/contactModel");

exports.getAbout = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: "about" }).select("-__v -key -_id");
    page = multilingual(page, req);

    res.json({ status: "success", page });
  } catch (error) {
    next(error);
  }
};

exports.getShipping = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: "shipping" }).select("-__v -key -_id");
    page = multilingual(page, req);

    res.json({ status: "success", page });
  } catch (error) {
    next(error);
  }
};

exports.getPrivacy = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: "privacy" }).select("-__v -key -_id");
    page = multilingual(page, req);

    res.json({ status: "success", page });
  } catch (error) {
    next(error);
  }
};

exports.getSpecialOrders = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: "special-orders" }).select(
      "-__v -key -_id"
    );
    page = multilingual(page, req);

    res.json({ status: "success", page });
  } catch (error) {
    next(error);
  }
};

exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne().select("-_id -__v -mailList");
    res.json({ status: "success", contact });
  } catch (error) {
    next(error);
  }
};

exports.postContact = async (req, res, next) => {
  try {
    await Message.create(req.body);
    res.status(201).json({ status: "success", message: "msg" });
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
      status: "success",
      message: "newsletter.success",
    });
  } catch (error) {
    next(error);
  }
};

exports.getBanners = async (req, res, next) => {
  try {
    let [banners, featured, config] = await Promise.all([
      Banner.find().sort("sort -_id").select("-_id -__v -name -sort"),
      Featured.find().sort("sort -_id").select("-_id -__v -name -sort"),
      Config.findOne(),
    ]);

    res.json({
      status: "success",
      minOrderAmount: config.minOrderAmount,
      filter: convertFilterFormat(config.filter),
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
    pages = pages.map((el) => multilingual(el, req));

    res.json({ status: "success", pages });
  } catch (error) {
    next(error);
  }
};

function convertFilterFormat(arr) {
  const formattedArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      formattedArray.push("Below $" + arr[i].toFixed(2));
    } else {
      const lowerBound = "$" + arr[i - 1].toFixed(2);
      const upperBound = "$" + arr[i].toFixed(2);
      const range = lowerBound + " - " + upperBound;
      formattedArray.push(range);
    }
  }
  formattedArray.push("$" + arr[arr.length - 1].toFixed(2) + " And Above");
  return formattedArray;
}
