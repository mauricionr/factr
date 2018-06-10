module.exports = class {
    onCreate() {
        this.state = {
            name: "Anonimo"
        }
    }

    onMount(){
        let u = FactrUser.token();
        this.state.name = u.email || "Anonimo";
    }
}