const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products')
// the '.' in the line above means to look inside the current directory

const app = express();

// the line below tells express to look into our current working directory. Then find the public file and make everything inside of their avaiable to the outside world
app.use(express.static('public'));

// this line makes it so all our route handlers have the middleware function to be able to parse data
app.use(bodyParser.urlencoded({ extended: true }));
// this cookie line encypt the info stored inside the cookie. So people cant manipulate it to access other peoples info
app.use(
  cookieSession({
  keys: ['lsadefs']
}));
app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);

app.listen(3000, () => {
  console.log('listening');
})
