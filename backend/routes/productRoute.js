const express = require('express');
const { getProducts, getProduct, createProduct, deleteProduct } = require('../middleware/ProductUtilities');
const { authenticate } = require('../middleware/Authentication');
const User = require('../models/User');
const router = express.Router();

// for all products list
router.get('/products/all', authenticate, getProducts);

// for single product details
router.get('/product/:id', authenticate, getProduct);

// create new product
router.post('/product/create', authenticate, createProduct);

// delete a product
router.delete('/delete/:id', authenticate, deleteProduct);

// get the user
router.get('/user', authenticate, async(req, res) => {
    const user = await User.findById(req.userId);
    res.status(200).json({ user });
});

module.exports = router; 