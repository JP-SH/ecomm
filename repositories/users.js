const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repository requires a filename');
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8'
      })
    );
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

  async comparePasswords(saved, supplied) {
    // const result = saved.split('.');
    // const hashed  = result[0];
    // const salt = result[1];

    // this line is the exact same as the 3 lines above
    const [hashed, salt] = saved.split('.')
    const hashedSupplied = await scrypt(supplied, salt, 64);

    return hashed === hashedSupplied;
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
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
