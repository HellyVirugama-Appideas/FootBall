const Order = require('../models/orderModel');
const Product = require('../models/productModel');

module.exports = async function updateSoldCount() {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const startOfYesterday = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate()
        );
        const endOfYesterday = new Date(startOfYesterday);
        endOfYesterday.setHours(23, 59, 59, 999);

        const soldCountByProduct = await Order.aggregate([
            {
                $match: {
                    orderDate: { $gte: startOfYesterday, $lte: endOfYesterday },
                },
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    soldCounts: {
                        $push: {
                            type: '$items.type',
                            quantity: '$items.quantity',
                        },
                    },
                },
            },
        ]);

        for (const { _id, soldCounts } of soldCountByProduct) {
            const product = await Product.findById(_id);

            let soldCountPcs = 0;
            for (const { type, quantity } of soldCounts) {
                const conversionFactor =
                    type === 'pk' ? product.PK : product.CTN;
                soldCountPcs += quantity * conversionFactor;
            }

            product.sold += soldCountPcs;
            await product.save();
        }

        console.log('Sold count updated successfully for all products.');
    } catch (error) {
        console.error('Error updating sold count:', error);
    }
};
