const express = require('express');
const { validationResult } = require('exress/validator');
const multer = require('multer');
// the require statements above are getting something from an external library

const productsRepo = require('../../repositories/products');
const productNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');
// the require statements above are getting access to a file that i created in this app

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {

});

router.get('/admin/products/new', (req, res) => {
  res.send(productNewTemplate({}));
});

router.post('/admin/products/new', [requireTitle, requirePrice], upload.single('image'), async (req, res) => {
  const erros = validationResult(req);

  const image = req.file.buffer.toString('base64');
 const { title, price } = req.body;
 await productsRepo.create({ title, price, image });

  res.send('submitted');
})
module.exports = router;
