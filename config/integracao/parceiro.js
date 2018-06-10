const parceiroProvider = require('../providers/parceiros');
const Router = require('express').Router();


Router.post('/criar', (request, response) => {
  let respond = parseResponse(response);
  return parceiroProvider
      .add({ parceiro: request.body })
      .then(respond)
})

module.exports = Router;
