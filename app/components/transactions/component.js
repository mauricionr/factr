module.exports = class {
    onCreate() {
        this.state = {
            transactions: []
        }
    }

    onMount() {
        this.state.transactions = FactrUser.localTransactions();
    }
}