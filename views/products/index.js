const layout = require('.');

module.exports = ({ products }) => {
    const renderProducts = products.map(product => {
        return `
            <li>${product.title} _ ${product.price}</li>
        `;
    }).join('');

    return `
        <ul>${renderProducts}</ul>
    `;
}