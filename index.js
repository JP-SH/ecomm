const express = require('express')
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

// the '.' in the line above means to look inside the current directory

const app = express();

// this line makes it so all our route handlers have the middleware function to be able to parse data
app.use(bodyParser.urlencoded({ extended: true }));
// this cookie line encypt the info stored inside the cookie. So people cant manipulate it to access other peoples info
app.use(
  cookieSession({
  keys: ['lsadefs']
}));
app.use(authRouter);

app.listen(3000, () => {
  console.log('listening');
})
