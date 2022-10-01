const express = require('express');
const carts = require('../repositories/carts');
const router = express.Router();

const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');


router.post('/cart/products', async (req, res) => {
    let cart;
    if (!req.session.cartId) {
        console.log('Creating a new cart...');
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        console.log('Fetching an existing cart...');
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    const existingItem = cart.items.find(item => item.id === req.body.productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRepo.update(cart.id, { items: cart.items });

    res.redirect('/cart');
});


router.get('/cart', async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);
    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }

    res.send(cartShowTemplate({ items: cart.items }));
});

module.exports = router;