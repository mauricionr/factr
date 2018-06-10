const Api = require('./api');

module.exports = {
    endpoint: 'promotions',
    api: Api,

    query(params) {
        return this.api.query(this.endpoint, params)
    },

    get(id) {
        return this.api.get(this.endpoint, id)
    },

    get_by_partner(id) {
        return this.api.get('partners/promotions', id)
    }
}
