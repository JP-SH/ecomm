const express = require('express');
const multer = require('multer');
// the require statements above are getting something from an external library

const { handleErrors } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const { requireTitle, requirePrice } = require('./validators');
// the require statements above are getting access to a file that i created in this app

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  upload.single('image'),
 [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
 async (req, res) => {
  const image = req.file.buffer.toString('base64');
  const { title, price } = req.body;
  await productsRepo.create({ title, price, image });

  res.redirect('/admin/products');
  }
);
module.exports = router;
