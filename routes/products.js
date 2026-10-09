const express = require('express');
const router = express.Router();

// Temporary memory - products saved here for now
let products = [
  { id: 1, name: 'iPhone 15 Pro', price: 5000, category: 'phones', inStock: true },
  { id: 2, name: 'Samsung TV 55"', price: 2500, category: 'electronics', inStock: true }
];

// GET all products - http://localhost:3000/api/products
router.get('/', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});

// POST add product
router.post('/', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category || 'general',
    inStock: true
  };
  products.push(newProduct);
  res.json({ success: true, message: 'Product added!', data: newProduct });
});

module.exports = router;