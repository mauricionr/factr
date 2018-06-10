const Api = require('./api');

module.exports = {
    endpoint: 'transaction',
    api: Api,

    query(params) {
        return this.api.get(this.endpoint, params)
    },

    edit(item){
        return this.api.put(`${this.endpoint}/${item.partner.id}`, item)
    },

    get(id){
        return this.api.get(this.endpoint, id)
    },

    get_partner_by_category(id){
        return this.api.get('transaction_by_category', id)
    },

    add(transaction){
        return this.api.post(this.endpoint, transaction)
    },

    delete(transaction) {
        return this.api
            .delete(`${this.endpoint}/${transaction}`)
            .then(resp => this.query())
    }
}
