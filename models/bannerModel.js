const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name is required.'], trim: true },
    link: { type: String, required: [true, 'Link is required'], trim: true },
    image: { type: String, required: true },
    imageAlt: { type: String, trim: true },
    sort: { type: Number, default: 0 },
});

module.exports = new mongoose.model('Banner', bannerSchema);
