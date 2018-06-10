const Api = require('./api');

module.exports = {
    endpoint: 'categories',
    api: Api,

    query(params) {
        return this.api.query(this.endpoint, params)
    },

    edit(item){
        return this.api.put(`${this.endpoint}/${item.contact.id}`, item)
    },

    get(id) {
        return this.api.get(this.endpoint, id)
    },

    get_by_voucher(voucher, token) {
      let o = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'Accept': 'application/json'
        }
      }
      // return fetch('http://localhost:3000/categories_by_voucher?voucher=' + voucher, o).then(resp => resp.json())
      return fetch(api.url + '/categories_by_voucher?voucher=' + voucher, o).then(resp => resp.json())
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
