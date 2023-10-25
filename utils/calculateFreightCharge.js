const Freight = require('../models/freightModel');

module.exports = async function calculateFreightCharge(state, orderTotal) {
    try {
        const stateFreight = await Freight.findOne({
            state,
            minOrderValue: { $lte: orderTotal },
            $or: [
                { maxOrderValue: { $gte: orderTotal } },
                { maxOrderValue: { $exists: false } },
            ],
        });

        if (stateFreight) {
            let freightCharge;
            if (stateFreight.chargeType === 'fixed')
                freightCharge = stateFreight.freightCharge;
            else if (stateFreight.chargeType === 'percentage')
                freightCharge = (stateFreight.freightCharge / 100) * orderTotal;

            return freightCharge.toFixed(2);
        } else {
            return 0;
        }
    } catch (error) {
        console.log(error);
        throw new Error('Failed to calculate freight charge');
    }
};
