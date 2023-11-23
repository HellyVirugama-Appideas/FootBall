const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const Banner = require('../../models/bannerModel');
const Newsletter = require('../../models/newsletterModel');
const Testimonial = require('../../models/testimonialModel');

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findOne();
    res.render('banner', { banners });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.postAddBanner = async (req, res) => {
  try {
    const video = req.file ? `/uploads/${req.file.filename}` : undefined;

    const banner = await Banner.findOne();
    banner.video = video;

    await banner.save();

    req.flash('green', 'Banner updated successfully.');
    res.redirect('/banner');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/banner');
  }
};

exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.find().sort('-_id');
    res.render('testimonial', { testimonial });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.getAddTestimonial = (req, res) => res.render('testimonial_add');

exports.postAddTestimonial = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    await Testimonial.create({
      name: req.body.name,
      description: req.body.description,
      image,
    });

    req.flash('green', 'Testimonial added successfully.');
    res.redirect('/testimonial');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/testimonial');
  }
};

exports.getEditTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      req.flash('red', 'Testimonial not found!');
      return res.redirect('/testimonial');
    }

    res.render('testimonial_edit', { testimonial });
  } catch (error) {
    if (error.name === 'CastError') req.flash('red', 'testimonial not found!');
    else req.flash('red', error.message);
    res.redirect('/testimonial');
  }
};

exports.postEditTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      req.flash('red', 'Testimonial not found!');
      return res.redirect('/testimonial');
    }

    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        '../../public',
        testimonial.image
      );
      fs.unlink(oldImagePath, () => {});
      testimonial.image = `/uploads/${req.file.filename}`;
    }

    testimonial.name = req.body.name;
    testimonial.description = req.body.description;
    await testimonial.save();

    req.flash('green', 'Testimonial edited successfully.');
    res.redirect('/testimonial');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/testimonial');
  }
};

exports.getDeleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    const oldImagePath = path.join(
      __dirname,
      '../../public',
      testimonial.image
    );
    fs.unlink(oldImagePath, () => {});

    req.flash('green', 'Testimonial deleted successfully.');
    res.redirect('/testimonial');
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'TypeError')
      req.flash('red', 'Testimonial not found!');
    else req.flash('red', error.message);
    res.redirect('/testimonial');
  }
};

exports.getNewsletterList = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort('-_id');
    res.render('newsletter', { newsletters });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.getNewsletterExport = async (req, res) => {
  try {
    // Find users, create and send csv
    const newsletter = await Newsletter.find();

    const csvWriter = createCsvWriter({
      path: 'newsletter_list.csv',
      header: [
        { id: 'Sr', title: 'Sr' },
        { id: 'email', title: 'Email' },
      ],
    });

    const csvData = newsletter.map((el, i) => ({
      Sr: i + 1,
      email: el.email,
    }));

    await csvWriter.writeRecords(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=newsletter_list.csv'
    );
    const fileStream = fs.createReadStream('newsletter_list.csv');
    fileStream.pipe(res);
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/newsletter');
  }
};

exports.getMedia = async (req, res) => res.render('media');

exports.postMedia = async (req, res) => {
  const numberOfUploadedFiles = req.files.length;

  let message;
  if (numberOfUploadedFiles > 0)
    message = `${numberOfUploadedFiles} files uploaded successfully.`;
  else message = 'No files were uploaded.';

  req.flash('green', message);
  res.redirect(req.originalUrl);
};
