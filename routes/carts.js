const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

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
  const existingItem = cart.items.find(item => item.id === req.body.productId);
  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new prodcut id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items
  });
  await cartsRepo.update(cart.id, {
    items: cart.items
  });

  res.send('Product added to cart');
});

// Recieve a GET request to show all items in cart
router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/');
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    // item === { id:, quantity:}
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));
});

// Recieve a POST request to delete an item from a cart

module.exports = router;
