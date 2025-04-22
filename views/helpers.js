module.exports = {
  getError (errors, prop)  {
    // prop === 'email' || 'password' || 'passwordConfirmation
    try {
      return errors.mapped()[prop].msg;
      // errors.mapped returns an object with keys like email, password and passwordConfirmation. These keys have some properties but the one we want is the 'msg'. Which is the error message so for example password msg could be 'passwords dont match'.
    } catch (err) {
      return '';
    }
  }
};
