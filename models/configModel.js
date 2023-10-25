const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    minOrderAmount: { type: Number, default: 0 },
    filter: {
        type: [Number],
        validate: {
            validator: function (value) {
                return value.every(num => num > 0);
            },
            message: 'All filter values must be greater than 0.',
        },
    },
});

module.exports = mongoose.model('Config', configSchema);
