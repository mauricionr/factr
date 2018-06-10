const Api = require('./api');

module.exports = {
    endpoint: 'partners',
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
        return this.api.get('partners_by_category', id)
    },

    add(parceiro){
        return this.api.post(this.endpoint, parceiro)
    },

    delete(parceiro) {
        return this.api
            .delete(`${this.endpoint}/${parceiro}`)
            .then(resp => this.query())
    }
}
