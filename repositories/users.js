const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  async comparePasswords(saved, supplied) {
    // const result = saved.split('.');
    // const hashed  = result[0];
    // const salt = result[1];

    // this line is the exact same as the 3 lines above
    const [hashed, salt] = saved.split('.')
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString('hex');
  }

  async create(attrs) {
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const buff = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = ({
      ...attrs,
      password: `${buff.toString('hex')}.${salt}`
    });
    records.push(record);

    await this.writeAll(records);

    return record;
  }
}


// exporting it so that other files can get access to the class
// non optimal way to write it

// module.exports = UsersRepository;

// IF WE DID IT THIS WAY THIS IS HOW WE WOULD USE IT IN ANOTHER FILE

// const UsersRepository = require('./users');
// const repo = new UsersRepository('users.json');

// It makes it so that we have to create an instance of it to use it in the file. Which can cause problems because if I want to use it in another file and I create another instance but have a type  in the file names such as 'user.json'. It will mean I am working with 2 different datasets inside my application.

// best way to write it

// writing it like this prevents other files from recieving the entire class but rather an instance
module.exports = new UsersRepository('users.json');

// now in another file this can be called by
// const repo = require('./users');
// repo.getAll();
// repo.update();
