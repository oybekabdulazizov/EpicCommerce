const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');
const cookieSession = require('cookie-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['wks81nfn2883bawl2k21tn3']
}));

app.get('/', (req, res) => {
    res.send(`
        <div>
            Your ID:  ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up!</button>
            </form>
        </div> 
    `);
});

app.post('/', async (req, res) => {
    const { email, password, passwordConfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy({ email: email });

    if (existingUser) {
        return res.send('Email is already in use.');
    }

    if (password !== passwordConfirmation) {
        return res.send("Password must match.");
    }

    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.send('Account created!');
});

app.listen(3001, () => {
    console.log("Listening...");
});