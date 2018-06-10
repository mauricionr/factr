const express = require('express');
const Router = express.Router();
const templates = {
    perfil: require('../../app/pages/usuario/index'),
    entrar: require('../../app/pages/login/index'),
    creditos: require('../../app/pages/creditos/index'),
    scanner: require('../../app/pages/scanner/index'),
    cadastrar: require('../../app/pages/signup/index'),
    transferencias: require('../../app/pages/transferencias/index'),
    vendedor: require('../../app/pages/vendedor/index'),
    "efetuar-pagamento": require('../../app/pages/cliente/index'),
    "sucesso-pagamento": require('../../app/pages/sucessopgto/index'),
    "solicitar-pagamento": require('../../app/pages/solicitapgto/index')
}

for (let key in templates) {
    Router.get(`/${key}`, templates[key]);
}

module.exports = Router;
