const Router = require('express').Router();

const account  = {
    name: 'Test Human',
    email: 'test@example.com',
    password: 'anewpassword',
    password_confirmation: 'anewpassword',
    role: 'admin'
}

module.exports = {
    Router,
    account
};