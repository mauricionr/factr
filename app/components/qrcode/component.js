module.exports = class {
  onMount() {
    this.state = {
      amount: 0,
      qrCode: 'qrcode'
    }
  }

  onUserSubmit(event) {
    event.preventDefault()
    document.querySelector('#qrcode').innerHTML = "";
    let amount = document.querySelector('#amount');
    this.state.amount = amount.value
    amount.blur();
    let receiver = FactrUser.token();
    FactrUser.applyQrCode(this.state.qrCode, `${this.state.amount}:${receiver.email}`);
  }

}