const Router = require('express').Router();
const Auth = require('./auth');
const User = require('./user');
const Parceiro = require('./parceiro');

Router.use('/auth', Auth);
Router.use('/users', User.Router);
Router.use('/parceiros', Parceiro);

module.exports = Router;
