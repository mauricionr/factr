const URLSearchParams = require('urlsearchparams').URLSearchParams;

module.exports = {
    // url: `https://api.restituasempre.com.br`,
    // url: 'http://localhost:3000',
    url : process.env.URL || `https://Factr-api-prod.herokuapp.com/`,
    http: require('./http'),
    handleError(err) {
        console.log(err)
    },

    query(endpoint, params = [], options = {}) {
        if (params) {
            let p = new URLSearchParams();
            for (let k in params) {
                p.set(k, params[k]);
            }
            if (params.length && params instanceof Array) {
                params = '?' + params.join('&')
            } else if (params.length) {
                endpoint += '/' + params
            } else {
                params = [];
            }
            // Set the search field if we have params and don't already have
            // a search field set in options.
            options.search = !options.search && p || options.search;
        }

        return this.http.get(this.url + '/' + endpoint + params, options)
    },

    get(endpoint, param) {
        return this.http.get(this.url + '/' + endpoint + '/' + param)
    },

    post(endpoint, body) {
        return this.http.post(this.url + '/' + endpoint, body)
    },

    put(endpoint, body) {
        return this.http.put(`${this.url}/${endpoint}`, body);
    },

    delete(endpoint, body) {
        return this.http.delete(`${this.url}/${endpoint}`, body);
    },

    patch(endpoint, body) {
        return this.http.put(`${this.url}/${endpoint}`, body);
    }
}
