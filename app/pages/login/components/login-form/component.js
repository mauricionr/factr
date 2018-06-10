const integrationUri = require('../../../uri.js')

module.exports = class {
  onCreate() {
    this.state = {
      email: false,
      password: false,
      form: {
        email: "",
        password: ""
      },
      display: {},
      valid: {},
      validMessage: {},
    }
  }

  auth(payload) {
    return fetch('/integracao/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(function(response) {
      return response.json()
    })
  }
  verify_email() {
    return fetch(integrationUri.api + `users/email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json '
      },
      body: JSON.stringify({
        email: this.getEl('email').value
      })
    }).then(function(response) {
      return response.json()
    });
  }

  displayTextEmail(email, propertie) {
    if (email) {
      this.verify_email().then((json) => {
          if (json.confirm) {
            this.state.valid[propertie] = true
            this.state.validMessage[propertie] = null
          } else {
            this.state.valid[propertie] = false
            this.state.validMessage[propertie] = "Esse e-mail não está cadastro no sistema"
          }
        })
        .catch(reason => {
          this.state.valid[propertie] = false
          this.state.validMessage[propertie] = "Esse e-mail não está cadastro no sistema"
        });
    } else {
      this.state.valid[propertie] = false
      this.state.validMessage[propertie] = "Por favor, insira um e-mail"
    }
    return email
  }
  displayTextPass(text, propertie) {
    if (text) {
      this.state.valid[propertie] = true
      this.state.validMessage[propertie] = null
    } else {
      this.state.valid[propertie] = false
      this.state.validMessage[propertie] = "Por favor, insira uma senha"
    }
    return text;
  }

  handleChange(propertie, e) {
    this.state.form[propertie] = this.getEl(propertie).value
  }

  handleFocus(propertie, e) {
    this.state[propertie] = true;
  }

  handleBlur(propertie, type, e) {
    this.state[propertie] = false;

    if (type == "mail") {
      this.state.display[propertie] = this.displayTextEmail(this.getEl(propertie).value, propertie);
    } else if (type == "pass") {
      this.state.display[propertie] = this.displayTextPass(this.getEl(propertie).value, propertie);
    } else {
      this.state.display[propertie] = this.getEl(propertie).value;
    }
  }

  login() {
    var payload = {
      email: this.getEl('email').value,
      password: this.getEl('password').value
    };
    FactrUser.setToken(JSON.stringify(payload));
    return window.location.assign('/');
    // this.auth()
    //   .then((json) => {
    //     if (json.errors) {
    //       console.log("Erro ao logar:\n\t" + json.errors.join('\n\t'));
    //       toastMessage("Erro ao logar")
    //     } else {
    //       json.user.auth_token = json.auth_token;
    //       localStorage.setItem("currentUserToken", json.auth_token)
    //       FactrUser.put(json.user)
    //       setTimeout(function() {
    //         window.location.assign('/');
    //       }, 1000);
    //     }
    //   })
    //   .catch(reason => {
    //     toastMessage("Erro ao logar");
    //     console.log("Erro ao logar: " + reason);
    //   });
  }
};
