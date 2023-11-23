const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  video: { type: String, required: [true, 'Video is required.'] },
});

module.exports = new mongoose.model('Banner', bannerSchema);
