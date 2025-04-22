const layout = require('../layout');

const getError = (errors, prop) => {
  // prop === 'email' || 'password' || 'passwordConfirmation
  try {
    return errors.mapped()[prop].msg;
    // errors.mapped returns an object with keys like email, password and passwordConfirmation. These keys have some properties but the one we want is the 'msg'. Which is the error message so for example password msg could be 'passwords dont match'.
  } catch (err) {
    return '';
  }
};

module.exports = ({ req, errors }) => {
  return layout({
    content:`
        <div>
          Your id is: ${req.session.userId}
          <form method="POST">
            <input name="email" placeholder="email" />
            ${getError(errors,'email')}
            <input name="password" placeholder="password" />
            ${getError(errors,'password')}
            <input name="passwordConfirmation" placeholder="password confirmation" />
            ${getError(errors,'passwordConfirmation')}
            <button>Sign Up</button>
          </form>
        </div>
    `
  });
};
