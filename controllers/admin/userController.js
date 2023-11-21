const User = require('../../models/userModel');
const Message = require("../../models/messageModel");

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

exports.getAllMessages = async (req, res) => {
  try {
    const msgs = await Message.find().sort("-_id");
    res.render("message", { msgs });
  } catch (error) {
    console.log(error);
    req.flash("red", error.message);
    res.redirect("/");
  }
};

exports.viewMessages = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      req.flash("red", "Message not found!");
      return res.redirect("/message");
    }

    res.render("message_view", { message });
  } catch (error) {
    if (error.name === "CastError") req.flash("red", "Message not found!");
    else req.flash("red", error.message);
    res.redirect("/message");
  }
};
