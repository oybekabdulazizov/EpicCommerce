const layout = require('../layout');

module.exports = ({ items }) => {
    const renderedItems = items.map(item => {
        return `
            <div>
                ${item.product.title} _ ${item.quantity} x ${item.product.price} = ${item.quantity * item.product.price}
            </div>
        `;
    }).join('');

    return layout({
        content: `
            <div class="container">
                <h1>Cart</h1>
                ${renderedItems}
            </div>
        `
    })
}