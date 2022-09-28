const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTempalte = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTempalte({ req }));
});

router.post('/signup', 
        [
            check('email')
                .trim()
                .normalizeEmail()
                .isEmail()
                .custom(async (email) => {
                    const existingUser = await usersRepo.getOneBy({ email });

                    if (existingUser) {
                        throw new Error('Email is already in use.');
                    }
                }), 
            check('password')
                .trim()
                .isLength({ min: 8, max: 24}),
            check('passwordConfirmation')
                .trim()
                .isLength({ min: 8, max: 24})
                .custom((passwordConfirmation, { req }) => {
                    if (passwordConfirmation !== req.body.password) {
                        throw new Error('Password must match.');
                    }
                })
        ],
        async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    const { email, password, passwordConfirmation } = req.body;

    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.send('Account created!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out.');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });
    if (!user) {
        return res.send('Email does not exist.');
    }

    const validPassword = await usersRepo.correctPassword(user.password, password)
    if (!validPassword) {
        return res.send('Invalid password.');
    }

    req.session.userId = user.id;

    res.send('You are signed in.')
});

module.exports = router;