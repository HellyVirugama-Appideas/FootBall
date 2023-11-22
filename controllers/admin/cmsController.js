const deleteFile = require("../../utils/deleteFile");

const Contact = require("../../models/contactModel");
const Page = require("../../models/pageModel");
const FAQs = require("../../models/faqsModel");

exports.getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) contact = await Contact.create({});

    res.render("contact", { contact });
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/");
  }
};

exports.postContact = async (req, res) => {
  try {
    const contact = await Contact.findOne();

    contact.address = req.body.address;
    contact.phone = req.body.phone;
    contact.email = req.body.email;

    await contact.save();

    req.flash("green", "Contact us updated successfully.");
    res.redirect("/cms/contact");
  } catch (error) {
    req.flash("red", error.message);
    res.redirect(req.originalUrl);
  }
};

exports.getAbout = async (req, res) => {
  try {
    const page = await Page.findOne({ key: "about" });
    res.render("about", { page });
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/");
  }
};

exports.postAbout = async (req, res) => {
  try {
    const page = await Page.findOne({ key: "about" });

    page.title = req.body.title;
    page.content = req.body.EnContent;

    if (req.file) {
      deleteFile(page.image);
      page.image = `/uploads/${req.file.filename}`;
    }

    await page.save();

    req.flash("green", "About us updated successfully.");
    res.redirect("/cms/about");
  } catch (error) {
    req.flash("red", error.message);
    res.redirect(req.originalUrl);
  }
};

exports.getPrivacy = async (req, res) => {
  try {
    const page = await Page.findOne({ key: "privacy" });
    res.render("privacy", { page });
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/");
  }
};

exports.postPrivacy = async (req, res) => {
  try {
    const page = await Page.findOne({ key: "privacy" });

    page.title = req.body.title;
    page.content = req.body.EnContent;

    if (req.file) {
      deleteFile(page.image);
      page.image = `/uploads/${req.file.filename}`;
    }

    await page.save();

    req.flash("green", "Privacy notice updated successfully.");
    res.redirect("/cms/privacy");
  } catch (error) {
    req.flash("red", error.message);
    res.redirect(req.originalUrl);
  }
};


exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQs.find().sort("-_id");
    res.render("faqs", { faqs, photo: req.admin.photo });
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/");
  }
};

exports.getAddFAQ = (req, res) =>
  res.render("faqs_add", { photo: req.admin.photo });

exports.postAddFAQ = async (req, res) => {
  try {
    await FAQs.create({
        question: req.body.EnQue,
        answer: req.body.EnAns,
    });

    req.flash("green", "FAQ added successfully.");
    res.redirect("/cms/faqs");
  } catch (error) {
    req.flash("red", error.message);
    res.redirect(req.originalUrl);
  }
};

exports.getEditFAQ = async (req, res) => {
  try {
    const faq = await FAQs.findById(req.params.id);
    if (faq == null) {
      req.flash("red", "FAQ not found!");
      return res.redirect("/cms/faqs");
    }

    res.render("faqs_edit", { faq, photo: req.admin.photo });
  } catch (error) {
    if (error.name === "CastError") {
      req.flash("red", "FAQ not found!");
      res.redirect("/cms/faqs");
    } else {
      req.flash("red", error.message);
      res.redirect("/cms/faqs");
    }
  }
};

exports.postEditFAQ = async (req, res) => {
  try {
    const faq = await FAQs.findById(req.params.id);
    if (faq == null) {
      req.flash("red", "FAQ not found!");
      return res.redirect("/cms/faqs");
    }

    faq.question = req.body.EnQue;
    faq.answer = req.body.EnAns;
    await faq.save();

    req.flash("green", "FAQ edited successfully.");
    res.redirect("/cms/faqs");
  } catch (error) {
    if (error.name === "CastError") {
      req.flash("red", "FAQ not found!");
      res.redirect("/cms/faqs");
    } else {
      req.flash("red", error.message);
      res.redirect(req.originalUrl);
    }
  }
};

exports.getdeleteFAQ = async (req, res) => {
  try {
    await FAQs.findByIdAndRemove(req.params.id);

    req.flash("green", "FAQ deleted successfully.");
    res.redirect("/cms/faqs");
  } catch (error) {
    if (error.name === "CastError" || error.name === "TypeError") {
      req.flash("red", "FAQ not found!");
      res.redirect("/cms/faqs");
    } else {
      req.flash("red", error.message);
      res.redirect("/cms/faqs");
    }
  }
};