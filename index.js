const express = require('express')
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users')
// the '.' in the line above means to look inside the current directory

const app = express();

// this line makes it so all our route handlers have the middleware function to be able to parse data
app.use(bodyParser.urlencoded({ extended: true }));
// this cookie line encypt the info stored inside the cookie. So people cant manipulate it to access other peoples info
app.use(cookieSession({
  keys: ['lsadefs']
}));

app.get('/', (req, res) => {
  res.send(`
    <div>
      Your id is ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button> Sign up </button>
      </form>
    </div>
    `);
});



app.post('/', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy ({ email });
  if (existingUser) {
    return res.send('Email already in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords must match');
  }

  // Create a user in our user repo to represent this person
  // because 'email: email' and 'password: password' are both the same things i can write like how i did below
  const user = await usersRepo.create({ email, password });

  // Store the id of that user inside the users cookie
  // the cookie session library  adds this 'session' property to the 'req' object in the POST request
  req.session.userId = user.id;

  res.send('Account created!!')
})

app.listen(3000, () => {
  console.log('listening');
})
