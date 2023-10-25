const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    address: {
        type: String,
        required: [true, 'Address is required.'],
        trim: true,
        default: '4423 E. Bandini Blvd. Los Angeles, CA 90058',
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
        default: 'sales@dollarempirellc.com',
    },
    phone: {
        type: String,
        required: [true, 'Phone is required.'],
        trim: true,
        default: '323-268-8999',
    },
    mailList: [String],
});

module.exports = mongoose.model('Contact', ContactSchema);
