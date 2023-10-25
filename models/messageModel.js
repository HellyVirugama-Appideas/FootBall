const mongoose = require('mongoose');
const validator = require('validator');

const messageSchema = new mongoose.Schema({
    fname: { type: String, required: [true, 'validation.fname'], trim: true },
    lname: { type: String, required: [true, 'validation.lname'], trim: true },
    email: {
        type: String,
        required: [true, 'validation.email'],
        lowercase: true,
        validate: [validator.isEmail, 'validation.emailInvalid'],
    },
    phone: {
        type: String,
        required: [true, 'validation.phone'],
        validate(value) {
            if (!validator.isMobilePhone(value, 'any', { strictMode: true }))
                throw new Error('Phone is invalid');
        },
    },
    comments: {
        type: String,
        required: [true, 'validation.comments'],
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = new mongoose.model('Message', messageSchema);
