const deleteFile = require('../../utils/deleteFile');

const Contact = require('../../models/contactModel');
const Page = require('../../models/pageModel');

exports.getContact = async (req, res) => {
    try {
        let contact = await Contact.findOne();
        if (!contact) contact = await Contact.create({});

        res.render('contact', { contact });
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/');
    }
};

exports.postContact = async (req, res) => {
    try {
        const contact = await Contact.findOne();

        contact.address = req.body.address;
        contact.phone = req.body.phone;
        contact.email = req.body.email;

        await contact.save();

        req.flash('green', 'Contact us updated successfully.');
        res.redirect('/cms/contact');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect(req.originalUrl);
    }
};

exports.getAbout = async (req, res) => {
    try {
        const page = await Page.findOne({ key: 'about' });

        res.render('about', { page });
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/');
    }
};

exports.postAbout = async (req, res) => {
    try {
        const page = await Page.findOne({ key: 'about' });

        page.en.title = req.body.EnTitle;
        page.es.title = req.body.EsTitle;
        page.en.content = req.body.EnContent;
        page.es.content = req.body.EsContent;

        if (req.file) {
            deleteFile(page.image);
            page.image = `/uploads/${req.file.filename}`;
        }

        await page.save();

        req.flash('green', 'About us updated successfully.');
        res.redirect('/cms/about');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect(req.originalUrl);
    }
};

exports.getPrivacy = async (req, res) => {
    try {
        const page = await Page.findOne({ key: 'privacy' });

        res.render('privacy', { page });
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/');
    }
};

exports.postPrivacy = async (req, res) => {
    try {
        const page = await Page.findOne({ key: 'privacy' });

        page.en.title = req.body.EnTitle;
        page.es.title = req.body.EsTitle;
        page.en.content = req.body.EnContent;
        page.es.content = req.body.EsContent;

        if (req.file) {
            deleteFile(page.image);
            page.image = `/uploads/${req.file.filename}`;
        }

        await page.save();

        req.flash('green', 'Privacy notice updated successfully.');
        res.redirect('/cms/privacy');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect(req.originalUrl);
    }
};
