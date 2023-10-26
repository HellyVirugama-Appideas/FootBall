const mongoose = require('mongoose');
const validator = require('validator');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fname: { type: String, required: [true, 'validation.fname'], trim: true },
    lname: { type: String, required: [true, 'validation.lname'], trim: true },
    email: {
        type: String,
        required: [true, 'validation.email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'validation.emailInvalid'],
    },
    password: {
        type: String,
        required: [true, 'validation.password'],
        minlength: [6, 'Password should be atleast 6 characters long.'],
        trim: true,
        select: false,
    },
    phone: {
        type: String,
        required: [true, 'validation.phone'],
        validate(value) {
            if (!validator.isMobilePhone(value, 'any'))
                throw new Error('Phone is invalid');
        },
    },
    location: {
        type: String,
        trim: true,
        // required: [true, 'validation.location'],
    },
    city: { type: String, trim: true, required: [true, 'validation.city'] },
    state: { type: String, trim: true, required: [true, 'validation.state'] },
    country: {
        type: String,
        trim: true,
        required: [true, 'validation.country'],
        default: 'United States',
    },
    postalCode: {
        type: String,
        trim: true,
        required: [true, 'validation.postalCode'],
    },

    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    blocked: { type: Boolean, default: false, select: false, immutable: true },
    date: { type: Date, default: Date.now },
    lastLogin: Date,
    visit: { type: Number, default: 0 },
    lastDownload: Date,
    downloadCount: { type: Number, default: 0 },
});

// Generating tokens
userSchema.methods.generateAuthToken = function () {
    try {
        return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: '90d',
        });
    } catch (error) {
        throw createError.BadRequest(error);
    }
};

// Converting password into hash
userSchema.post('validate', async function (doc) {
    if (doc.isModified('password')) {
        if (doc.password) doc.password = await bcrypt.hash(doc.password, 10);
    }
});

// check password
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = new mongoose.model('User', userSchema);
