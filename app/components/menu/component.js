module.exports = class {
    onCreate() {
        this.state = {
            user: {
                email: ''
            }
        }
    }

    onMount(){
        this.state.user = FactrUser.token();
    }
}