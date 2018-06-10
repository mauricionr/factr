const Api = require('./api');

module.exports = {
  user: {},
  endpoint: 'users',
  api: Api,

  login(accountInfo) {
    console.log('[Account info]', JSON.stringify(accountInfo))
    return this.api
      .post('auth/login', accountInfo)
      .then(res => this._loggedIn(res));
  },

  signup(accountInfo) {
    console.log('[Signup payload]', JSON.stringify(accountInfo))
    return this.api
      .post('users', accountInfo)
      .then(res => this._loggedIn(res))
  },

  logout() {
    this._user = {};
    this.auth_token = null
    return Promise.resolve(false);
  },

  _loggedIn(resp) {
    console.log('[Login response]', resp);
    !resp.user ? this.flag = "[ERRO]" : this.flag = "[OK]";
    this._user = resp.user;
    this.auth_token = resp.auth_token
    return Promise.resolve(resp);
  }
}
