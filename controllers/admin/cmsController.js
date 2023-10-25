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

        const mailList = req.body.mailList
            .split(',')
            .filter(item => item !== '');

        contact.address = req.body.address;
        contact.phone = req.body.phone;
        contact.email = req.body.email;
        contact.mailList = mailList;

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

exports.getShippingFreight = async (req, res) => {
    try {
        const page = await Page.findOne({ key: 'shipping' });

        res.render('shipping', { page });
    } catch (error) {
        console.log(error);
        req.flash('red', error.message);
        res.redirect('/');
    }
};

exports.postShippingFreight = async (req, res) => {
    try {
        const page = await Page.findOne({ key: 'shipping' });

        page.en.title = req.body.EnTitle;
        page.es.title = req.body.EsTitle;
        page.en.content = req.body.EnContent;
        page.es.content = req.body.EsContent;

        if (req.file) {
            deleteFile(page.image);
            page.image = `/uploads/${req.file.filename}`;
        }

        await page.save();

        req.flash('green', 'Shipping & freight updated successfully.');
        res.redirect('/cms/shipping-freight');
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

exports.getSpecialOrders = async (req, res) => {
    try {
        const page = await Page.findOne({ key: 'special-orders' });

        res.render('special_orders', { page });
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/');
    }
};

exports.postSpecialOrders = async (req, res) => {
    try {
        const page = await Page.findOne({ key: 'special-orders' });

        page.en.title = req.body.EnTitle;
        page.es.title = req.body.EsTitle;
        page.en.content = req.body.EnContent;
        page.es.content = req.body.EsContent;

        if (req.file) {
            deleteFile(page.image);
            page.image = `/uploads/${req.file.filename}`;
        }

        await page.save();

        req.flash('green', 'Special orders updated successfully.');
        res.redirect('/cms/special-orders');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect(req.originalUrl);
    }
};
