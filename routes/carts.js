const express = require('express');
const cartsRepo = require('../repositories/carts');

const router = express.Router();

// Recieve a POST request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  console.log(req.body.productId);
// Figure out the cart
  let cart;
  if (!req.session.cartId) {
    // This is if we dont have a cart, we need to create one
    // and store the cart id on the req.session.cartId property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // This is we have a cart. Lets get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }

// Either increment quantity for existing product
// OR add new product to items array
  console.log(cart);

  res.send('Product added to cart');
});

// Recieve a GET request to show all items in cart

// Recieve a POST request to delete an item from a cart

module.exports = router;
