const express = require('express')
const bodyParser = require('body-parser');

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



app.post('/', (req, res) => {
  console.log(req.body);
  res.send('Account created!!')
})

app.listen(3000, () => {
  console.log('listening');
})
