const schema = require('./schema.js')
const o = require('../../../uri.js')

module.exports = class {
  onInput(input) {
    this.state = {
      form: {
        name:"",
        limit:"",
        image:"",
        voucher:"",
        commercial_limit_date:"",
        commercial_limit_time:""
      },
      display: {},
      valid: {},
      validMessage: {},
      endpoint: `categories`
    }

    this.state = Object.assign(this.state, schema, input)
  }

  cancel(){
    // alert(this.state.cidades)
  }

  create() {
    let data = Object.assign({}, this.state.form)
    fetch(o.api + this.state.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': FactrUser.getToken(),
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function (response) {
      alert("Cadastro realizado com sucesso.")
      window.location.assign('/');
    })
  }

  displayTextNumber(number, propertie) {
    if (number) { //99.999-999
      let onlyNumbers = /([0-9])$/;
      if (!onlyNumbers.test(number)) {
        this.state.valid[propertie] = false
        this.state.validMessage[propertie] = "O campo Limite só aceita números"
        return number;
      } else {
        this.state.valid[propertie] = true
        this.state.validMessage[propertie] = null
        return number;
      }
    } else {
      this.state.valid[propertie] = false
      this.state.validMessage[propertie] = "Esse campo não pode ficar em branco"
      return number
    }
  }


  handleChange(propertie, e){ this.state.form[propertie] = e.srcElement.value }

  handleFocus(propertie, e) { this.state[propertie] = true; }

  handleBlur(propertie, type, e) {
    this.state[propertie] = false;

    if (type == "number") this.state.display[propertie] = this.displayTextNumber(e.srcElement.value, propertie);
    else if (type == "pass") this.state.display[propertie] = this.displayTextPass(e.srcElement.value, propertie);
    else this.state.display[propertie] = e.srcElement.value;
  }
};
