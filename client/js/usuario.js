var FactrUser = (function (QRCode) {
    var response = {
        user: {},
        get: function () {
            return JSON.parse(localStorage.getItem('user-' + localStorage.getItem('currentUserId')) || "{}");
        },
        setToken: function (token) {
            return new Promise(function (resolve) {
                localStorage.setItem('currentUserToken', token);
                return resolve(token);
            })
        },
        getQrCode: function () {
            return this.user.qrcode//TODO: definir se vai ser o auth_token ou gerar uma hash no rails para o usuario no signup
        },
        applyQrCode: function (id, key) {
            var qrcode = new QRCode((id || "qrcode"), {
                text: key,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        },
        put: function (json) {
            this.user = json;
            return new Promise(function (resolve) {
                localStorage.setItem('currentUserId', json.id);
                localStorage.setItem('user-' + json.id, JSON.stringify(json))
                return resolve(this.get())
            }.bind(this))
        },
        getByQrCode: function (qrcode, authToken) {
            return fetch(`//Factr-api-dev.sa-east-1.elasticbeanstalk.com/qrcode?code=${qrcode}`, {
                headers: {
                    "Authorization": authToken,
                    "Accept": "application/json"
                }
            })
        },
        getToken: function(){
            return this.user.auth_token//TODO: definir se vai ser o auth_token ou gerar uma hash no rails para o usuario no signup
        },
        token: function(){
            return JSON.parse(localStorage.getItem('currentUserToken') || "{}")
        },
        localTransactions: function(){
            return JSON.parse(localStorage.getItem('localTransactions') || "[]");
        },
        addLocalTransaction: function(tx){
            let localTxs = this.localTransactions();
            localTxs.push(tx)
            localStorage.setItem('localTransactions', JSON.stringify(localTxs));
        }
    }

    response.user = response.get();

    const updateLocalTransactions = () => {
        debugger;
        window.isOnline = true;
    }

    const saveLocalTranscations = () => {
        debugger;
        window.isOnline = false;
    }

    window.addEventListener('online', updateLocalTransactions);
    window.addEventListener('offline', saveLocalTranscations);

    return response;
})(QRCode);
