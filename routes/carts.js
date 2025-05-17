const express = require('express');

const router = express.Router();

// Recieve a POST request to add an item to a cart
router.post('/cart/products', (req, res) => {
  console.log(req.body.productId);

  res.send('Product added to cart');
});

// Recieve a GET request to show all items in cart

// Recieve a POST request to delete an item from a cart

module.exports = router;
