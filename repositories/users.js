const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async comparePasswords(saved, supplied) {
        const [hashedPasswordSaved, salt] = saved.split('.');
        const hashedPasswordSupplied = await scrypt(supplied, salt, 64);

        return hashedPasswordSaved === hashedPasswordSupplied.toString('hex');
    } 


    async create(attributes) {
        attributes.id = this.randomId();
        const salt = this.salt();
        const hashedPassword = await scrypt(attributes.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attributes,
            password: `${hashedPassword.toString('hex')}.${salt}`
        };
        records.push(record);

        await this.writeAll(records);

        return record;
    }

    salt() {
        return crypto.randomBytes(8).toString('hex');
    }
}

module.exports = new UsersRepository('users.json');