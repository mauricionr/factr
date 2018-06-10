const o = require('../../../uri.js')

module.exports = class {
  onCreate(){
      this.state = {
        email: false,
        password: false,
        password_confirmation: false,
        form: {
          email: "",
          password: "",
          password_confirmation: ""
        },
        perfil: "",
        display: {},
        valid: {},
        validMessage: {},
      }
  }
  create_user(){
    FactrUser.setToken(JSON.stringify(this.state.form));
    return window.location.assign('/')
    // return fetch('/integracao/auth/signup', {
    //     method: 'POST',
    //     headers: {
    //          'Content-Type': 'application/json'
    //      },
    //     body: JSON.stringify(this.state.form)
    // }).then(function(response){return response.json()})
  }

  displayTextEmail(email, propertie) {
    if (email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)) {
        this.state.valid[propertie] = false
        this.state.validMessage[propertie] = "Os campos de E-mail devem ser preenchidos corretamente. Ex.: <i>meuemail@provedor.com.br</i>"
      } else {
        this.state.valid[propertie] = true
      }
      return email;
    } else {
      this.state.valid[propertie] = false
      this.state.validMessage[propertie] = "Esse campo não pode ficar em branco"
      return email
    }
  }
  displayTextPass(text, propertie) {
    if (text) {
      if (text.length < 6) {
        this.state.valid[propertie] = false
        this.state.validMessage[propertie] = "Esse campo deve ter no mínimo 6 caracteres"
        return text
      } else {
        this.state.valid[propertie] = true
        this.state.validMessage[propertie] = null
        return text
      }
    } else {
      this.state.valid[propertie] = false
      this.state.validMessage[propertie] = "Esse campo não pode ficar em branco"
      return text;
    }
  }
  displayTextRPass(text, propertie) {
    if (text) {
      if (text != this.getEl('password').value) {
        this.state.valid[propertie] = false
        this.state.validMessage[propertie] = "As senhas não correspondem"
      } else {
        this.state.valid[propertie] = true
        this.state.validMessage[propertie] = null
      }
      return text
    } else {
      this.state.valid[propertie] = false
      this.state.validMessage[propertie] = "Esse campo não pode ficar em branco"
      return text;
    }
  }

  handleChange(propertie, e) { this.state.form[propertie] = this.getEl(propertie).value }

  handleFocus(propertie, e) { this.state[propertie] = true; }

  handleBlur(propertie, type, e) {
    this.state[propertie] = false;

    if (type == "mail") {this.state.display[propertie] = this.displayTextEmail(this.getEl(propertie).value, propertie);}

    else if (type == "pass") {this.state.display[propertie] = this.displayTextPass(this.getEl(propertie).value, propertie);}

    else if (type == "rpass") {this.state.display[propertie] = this.displayTextRPass(this.getEl(propertie).value, propertie);}

    else {this.state.display[propertie] = this.getEl(propertie).value;}
  }

  addType() {
    if (this.getEl("parceiro").checked == true)
      this.state.perfil = this.getEl("parceiro").value;
    else if (this.getEl("morador").checked == true)
      this.state.perfil = this.getEl("morador").value
  }

  onSignup(event){
    event.preventDefault();
    this.create_user();
    return;
    // this.addType()
    //  this.create_user()
    //  .then((json) => {
    //    if(json.errors){
    //      toastMessage("Erro ao cadastrar usuário");
    //      console.log("Erro ao cadastrar usuário: \n\t" + json.errors.join('\n\t'));
    //    }else{
    //      FactrUser.put(json.user)
    //      localStorage.setItem('currentUserToken', json.auth_token)
    //      toastMessage("Login cadastrado com sucesso! Redirecionando para continuar cadastro de perfil");
    //      if(this.state.perfil == "parceiro"){
    //        setTimeout(function() {
    //           window.location.assign('/verify');
    //        }, 1000);
    //      } else if(this.state.perfil == "morador") {
    //        setTimeout(function() {
    //           window.location.assign('/moradores');
    //        }, 1000);
    //      }
    //    }
    //  })
    //  .catch(reason => {
    //    toastMessage("Erro ao cadastrar usuário");
    //    console.log("Erro ao cadastrar usuário: " + reason);
    //  });
  }
};
