const o = require('../../../uri.js')

module.exports = class {
  onCreate(){
      this.state = {
        amount: "",
        resident: [],
        was_found: null,
        openamount: false,
        endpoint: `payment/`
      }
  }
  toggle(){
      this.getEl('amount').classList.toggle('app__dialog--hide');
  }
  search(){
    this.setState('amount', this.getEl('amount_result').value)
    this.get_resident(this.getEl('amount_result').value).then((json) => {
      if(!json.error){
        this.state.was_found = true
        this.state.resident = json.resident
      } else {
        this.state.was_found = false
        this.setState('resident', "")
      }
      console.log(json)
    }).catch(reason => {
      this.state.was_found = false
      this.setState('resident', "")
      toastMessage("Erro ao buscar Residente: " + reason);
    });
  }

  get_resident(amount) {
    return fetch(o.api + this.state.endpoint + amount, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': FactrUser.getToken(),
          'Accept': 'application/json'
        }
      }).then(function(response) {
        return response.json();
      })
  }
};
