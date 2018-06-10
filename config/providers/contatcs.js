const Api = require('./api');

module.exports = {
    endpoint: 'contacts',
    api: Api,

    query(params) {
        return this.api.get(this.endpoint, params)
    },

    edit(item){
        return this.api.put(`${this.endpoint}/${item.contact.id}`, item)
    },

    get(id) {
        return this.api.get(this.endpoint, id)
    },

    add(body){
        return this.api.post(this.endpoint, body)
    },

    delete(id) {
        return this.api
            .delete(`${this.endpoint}/${id}`)
            .then(resp => this.query())
    }
}
