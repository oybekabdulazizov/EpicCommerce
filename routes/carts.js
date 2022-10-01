const express = require('express');
const router = express.Router();


router.post('/cart/products', (req, res) => {
    console.log(req.body.productId);

    res.send('Product has been added to cart.');
});

module.exports = router;