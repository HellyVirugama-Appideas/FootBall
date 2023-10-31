const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const User = require('../../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('+blocked').sort('-_id');
        res.render('user', { users });
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/');
    }
};

exports.blockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { blocked: true },
            { strict: false }
        );
        req.flash('green', `'${user.name}' blocked successfully.`);
        res.redirect('/user');
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'TypeError')
            req.flash('red', 'User not found!');
        else req.flash('red', error.message);
        res.redirect('/user');
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { blocked: false },
            { strict: false }
        );
        req.flash('green', `'${user.name}' unblocked successfully.`);
        res.redirect('/user');
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'TypeError')
            req.flash('red', 'User not found!');
        else req.flash('red', error.message);
        res.redirect('/user');
    }
};
