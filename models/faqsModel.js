const mongoose = require('mongoose');

const faqsSchema = new mongoose.Schema({
        question: {
            type: String,
            required: [true, 'Question is required.'],
        },
        answer: {
            type: String,
            required: [true, 'Answer is required.'],
        },
});

module.exports = new mongoose.model('FAQs', faqsSchema);
