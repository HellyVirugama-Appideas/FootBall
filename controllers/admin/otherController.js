const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const Banner = require("../../models/bannerModel");
const Newsletter = require("../../models/newsletterModel");

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findOne();
    res.render("banner", { banners });
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/");
  }
};

exports.postAddBanner = async (req, res) => {
  try {
    const video = req.file ? `/uploads/${req.file.filename}` : undefined;

    const banner = await Banner.findOne();
    banner.video = video;

    await banner.save();

    req.flash("green", "Banner updated successfully.");
    res.redirect("/banner");
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/banner");
  }
};

exports.getNewsletterList = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort("-_id");
    res.render("newsletter", { newsletters });
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/");
  }
};

exports.getNewsletterExport = async (req, res) => {
  try {
    // Find users, create and send csv
    const newsletter = await Newsletter.find();

    const csvWriter = createCsvWriter({
      path: "newsletter_list.csv",
      header: [
        { id: "Sr", title: "Sr" },
        { id: "email", title: "Email" },
      ],
    });

    const csvData = newsletter.map((el, i) => ({
      Sr: i + 1,
      email: el.email,
    }));

    await csvWriter.writeRecords(csvData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=newsletter_list.csv"
    );
    const fileStream = fs.createReadStream("newsletter_list.csv");
    fileStream.pipe(res);
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/newsletter");
  }
};

exports.getMedia = async (req, res) => res.render("media");

exports.postMedia = async (req, res) => {
  const numberOfUploadedFiles = req.files.length;

  let message;
  if (numberOfUploadedFiles > 0)
    message = `${numberOfUploadedFiles} files uploaded successfully.`;
  else message = "No files were uploaded.";

  req.flash("green", message);
  res.redirect(req.originalUrl);
};
