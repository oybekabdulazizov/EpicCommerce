const { create } = require('domain');
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

    async delete(id) {
        const records = await this.getAll();
        const fileteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(fileteredRecords);
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');

    // await repo.delete('0695ef0d');

    await repo.create({
        email: "test@test.com", 
        password: "password01"
    });
    const users = await repo.getAll();
    console.log(users);
}

test();