const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requies a filename');
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
    }

    async create(attributes) {
        attributes.id = this.randomId();
        const records = await this.getAll();
        records.push(attributes);

        await this.writeAll(records);
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2), { encoding: 'utf8' });
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
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

    async delete(id) {
        const records = await this.getAll();
        const fileteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(fileteredRecords);
    }

    async update(id, attributes) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`User with id ${id} does not exist.`);
        }

        Object.assign(record, attributes);
        await this.writeAll(records);
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }
}

module.exports = new UsersRepository('users.json');