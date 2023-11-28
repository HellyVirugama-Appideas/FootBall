const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category Name is required.'],
    trim: true,
  },
});

module.exports = mongoose.model('Category', categorySchema);
