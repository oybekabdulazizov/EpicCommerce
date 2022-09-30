const Repository = require('./repository');

class ProductsRepository extends Repository {
}

module.expors = new ProductsRepository('products.json');