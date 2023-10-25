module.exports = function (user, items, order, card, address) {
    const currentDate = new Date();

    const shippingAddress =
        order.shippingMethod === 'freight'
            ? {
                  name: `${address.fname} ${address.lname}`,
                  location: address.location,
                  address: `${address.city}, ${address.state}, ${address.country}, ${address.postalCode}`,
                  phone: address.phone,
              }
            : undefined;

    const billingAddress =
        order.paymentMethod === 'cardPayment'
            ? {
                  name: card.nameOnCard,
                  location: card.street,
                  address: `${card.city}, ${card.state}, ${card.country}, ${card.postalCode}`,
              }
            : undefined;

    let totalWeight = 0;
    let totalVolume = 0;
    items.map(item => {
        if (item.type == 'ctn') {
            totalWeight += item.product.CTNWeight * item.quantity;
            totalVolume += item.product.CTNVolume * item.quantity;
        } else {
            totalWeight += item.product.PKWeight * item.quantity;
            totalVolume += item.product.PKVolume * item.quantity;
        }
    });

    return {
        name: user.fname,
        fullname: `${user.fname} ${user.lname}`,
        email: user.email,
        companyName: user.companyName,
        customerId: user.customerId || '-',
        orderId: order.orderId,
        orderDate: currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        products: items.map(item => {
            const product = item.product;
            const type = item.type.toUpperCase();
            const quantity = item.quantity;
            const unitPrice = product.price;
            const lineTotal = unitPrice * quantity * product[type];

            return {
                item: product.number,
                qty: quantity * product[type],
                unitPrice: unitPrice,
                lineTotal: lineTotal.toFixed(2),
            };
        }),
        additionalNotes: order.additionalNotes,
        totalItems: items.length,
        totalQty: order.totalQuantity,
        subtotal: order.subtotal,
        shipping: order.freight,
        total: order.total,
        totalVolume: totalVolume.toFixed(3),
        totalWeight: totalWeight.toFixed(2),
        shippingMethod:
            order.shippingMethod === 'freight' ? 'Delivery' : 'Pickup',
        paymentMethod:
            order.paymentMethod === 'cardPayment'
                ? `Card ending with ${card.cardNumber.slice(-4)}`
                : 'Contact for Payment',
        shippingAddress,
        billingAddress,
    };
};
