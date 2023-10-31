const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const Banner = require("../../models/bannerModel");
const Featured = require("../../models/featuredModel");
const Newsletter = require("../../models/newsletterModel");

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort("sort -_id");
    res.render("banner", { banners });
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/");
  }
};

exports.getAddBanner = (req, res) => res.render("banner_add");

exports.postAddBanner = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    await Banner.create({
      name: req.body.name,
      link: req.body.link,
      image,
      imageAlt: req.body.imageAlt,
    });

    req.flash("green", "Banner added successfully.");
    res.redirect("/banner");
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/banner");
  }
};

exports.getEditBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      req.flash("red", "Banner not found!");
      return res.redirect("/banner");
    }

    res.render("banner_edit", { banner });
  } catch (error) {
    if (error.name === "CastError") req.flash("red", "Banner not found!");
    else req.flash("red", error.message);
    res.redirect("/banner");
  }
};

exports.postEditBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      req.flash("red", "Banner not found!");
      return res.redirect("/banner");
    }

    if (req.file) {
      const oldImagePath = path.join(__dirname, "../../public", banner.image);
      fs.unlink(oldImagePath, () => {});
      banner.image = `/uploads/${req.file.filename}`;
    }

    banner.name = req.body.name;
    banner.link = req.body.link;
    banner.imageAlt = req.body.imageAlt;
    await banner.save();

    req.flash("green", "Banner edited successfully.");
    res.redirect("/banner");
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/banner");
  }
};

exports.sortBanners = async (req, res) => {
  try {
    const ids = req.body.order;

    const bulkOps = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sort: index + 1 } },
      },
    }));

    await Banner.bulkWrite(bulkOps);

    res.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getDeleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    const oldImagePath = path.join(__dirname, "../../public", banner.image);
    fs.unlink(oldImagePath, () => {});

    req.flash("green", "Banner deleted successfully.");
    res.redirect("/banner");
  } catch (error) {
    if (error.name === "CastError" || error.name === "TypeError")
      req.flash("red", "Banner not found!");
    else req.flash("red", error.message);
    res.redirect("/banner");
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const featured = await Featured.find().sort("sort -_id");
    res.render("featured", { featured });
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/");
  }
};

exports.getAddFeatured = (req, res) => res.render("featured_add");

exports.postAddFeatured = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    await Featured.create({
      name: req.body.name,
      link: req.body.link,
      image,
      imageAlt: req.body.imageAlt,
    });

    req.flash("green", "Featured added successfully.");
    res.redirect("/featured");
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/featured");
  }
};

exports.getEditFeatured = async (req, res) => {
  try {
    const featured = await Featured.findById(req.params.id);
    if (!featured) {
      req.flash("red", "Featured not found!");
      return res.redirect("/featured");
    }

    res.render("featured_edit", { featured });
  } catch (error) {
    if (error.name === "CastError") req.flash("red", "Featured not found!");
    else req.flash("red", error.message);
    res.redirect("/featured");
  }
};

exports.postEditFeatured = async (req, res) => {
  try {
    const featured = await Featured.findById(req.params.id);
    if (!featured) {
      req.flash("red", "Featured not found!");
      return res.redirect("/featured");
    }

    if (req.file) {
      const oldImagePath = path.join(__dirname, "../../public", featured.image);
      fs.unlink(oldImagePath, () => {});
      featured.image = `/uploads/${req.file.filename}`;
    }

    featured.name = req.body.name;
    featured.link = req.body.link;
    featured.imageAlt = req.body.imageAlt;

    await featured.save();

    req.flash("green", "Featured edited successfully.");
    res.redirect("/featured");
  } catch (error) {
    req.flash("red", error.message);
    res.redirect("/featured");
  }
};

exports.getDeleteFeatured = async (req, res) => {
  try {
    const featured = await Featured.findByIdAndDelete(req.params.id);

    const oldImagePath = path.join(__dirname, "../../public", featured.image);
    fs.unlink(oldImagePath, () => {});

    req.flash("green", "Featured deleted successfully.");
    res.redirect("/featured");
  } catch (error) {
    if (error.name === "CastError" || error.name === "TypeError")
      req.flash("red", "Featured not found!");
    else req.flash("red", error.message);
    res.redirect("/featured");
  }
};

exports.sortFeatured = async (req, res) => {
  try {
    const ids = req.body.order;

    const bulkOps = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sort: index + 1 } },
      },
    }));

    await Featured.bulkWrite(bulkOps);

    res.end();
  } catch (error) {
    res.status(500).send(error.message);
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
