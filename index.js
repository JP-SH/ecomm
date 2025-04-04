const express = require('express')
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users')
// the '.' in the line above means to look inside the current directory

const app = express();

// this line makes it so all our route handlers have the middleware function to be able to parse data
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <div>
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
  res.send('Account created!!')
})

app.listen(3000, () => {
  console.log('listening');
})
