const Api = require('./api');

module.exports = {
    endpoint: 'payment_methods',
    api: Api,

    query(params) {
        return this.api.query(this.endpoint, params)
    },

    get(id) {
        return this.api.get(this.endpoint, id)
    }
}
