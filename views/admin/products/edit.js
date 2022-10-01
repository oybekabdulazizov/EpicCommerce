const { getError } = require('../../helpers');
const layout = require('../layout');

module.exports = ({ errors, product }) => {
    return layout({
        content: `
            <form method="POST">
                <input placeholder="Title" name="title" value="${product.title}" />
                ${getError(errors, 'title')}
                <input placeholder="Price" name="price" value="${product.price}" />
                ${getError(errors, 'price')}
                <input name="image" type="file" />
                <button>Submit</button>
            </form>
        `
    });
};