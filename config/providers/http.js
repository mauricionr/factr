const fetch = require('node-fetch');

const http = {
    get(uri, options) {
        let o = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
        o = Object.assign({}, o, options);
        return fetch(uri, o).then(resp => resp.json())
    },
    post(uri, body) {
        let o = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        return fetch(uri, o).then(resp => resp.json())
    },
    postToken(uri, body, token) {
        let o = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': token }, body: JSON.stringify(body) }
        return fetch(uri, o).then(resp => resp.json())
    },
    put(uri, body) {
        let o = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        return fetch(uri, o).then(resp => resp.json())
    },
    delete(uri, body) {
        let o = { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        return fetch(uri, o).then(resp => resp.json())
    },
}
module.exports = http;
