const Router = require('express').Router();
const userProvider = require('../../config/providers/users');
const userModel = require('./user').account;

const parseResponse = response => {
    return resp => {
        if(resp.errors){
            return response.json({errors: resp.errors})
        }
        return response.json(resp);
    }
}

Router.post('/login', (request, response) => {
    let respond = parseResponse(response);
    return userProvider
        .login(request.body)
        .then(respond)
})

Router.post('/signup', (request, response) => {
    let respond = parseResponse(response);    
    return userProvider
        .signup({ user: request.body })
        .then(respond)
        
})

module.exports = Router;