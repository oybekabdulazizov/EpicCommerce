const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireTitle: check('title')
        .trim()
        .isLength({ min: 5, max: 40 }),
    requirePrice: check('price')
        .trim()
        .toFloat()
        .isFloat({ min: 1 }),
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) {
                throw new Error('Email is already in use.');
            }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 8, max: 24 })
        .withMessage('Must be between 8 and 24 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 8, max: 24 })
        .withMessage('Must be between 8 and 24 characters')
        .custom((passwordConfirmation, { req }) => {
            const { password } = req.body;
            if (passwordConfirmation !== password) {
                throw new Error('Password must match.');
            } else {
                return true;
            }
        }),
    requireEmailExists: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must provide a valid email')
        .custom(async (email) => {
            const user = await usersRepo.getOneBy({ email });
            if (!user) {
                throw new Error('Email not found.');
            }
        }),
    requireValidPassword: check('password')
        .trim()
        .custom(async (password, { req }) => {
            const { email } = req.body;

            const user = await usersRepo.getOneBy({ email });
            if (!user) {
                throw new Error('Invalid password.');
            }

            const validPassword = await usersRepo.comparePasswords(user.password, password)
            if (!validPassword) {
                throw new Error('Invalid password.');
            }
        })
}