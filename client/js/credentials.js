
"use strict";

/* global navigator,FormData, fetch*/

var PASSWORD_LOGIN = 'password';
var GOOGLE_SIGNIN = 'https://accounts.google.com';
var FACEBOOK_LOGIN = 'https://www.facebook.com';
var DEFAULT_IMG = '/client/images/default.png';

var credentialsAPI = {
    autoSignIn: function (unmediated) {
        if (navigator.credentials) {
            return navigator.credentials.get({
                password: navigator.credentials.preventSilentAccess ? true : false,
                federated: {
                    providers: [GOOGLE_SIGNIN, FACEBOOK_LOGIN]
                },
                unmediated: unmediated // `unmediated: true` lets the user automatically sign in
            }).then(function (credential) {
                // Ensure they're not empty
                if (!credential) {
                    return Promise.resolve();
                }
                this.signIn(credential, unmediated);
            }.bind(this));
        } else {
            return Promise.resolve(false);
        }
    },

    signIn: function (credential, autoSignIn) {
        switch (credential.type) {
            case 'password':
                return this.pwSignIn(credential, autoSignIn);
            case 'federated':
                switch (credential.provider) {
                    case GOOGLE_SIGNIN:
                        return this.googleSignIn(credential, autoSignIn);
                    case FACEBOOK_LOGIN:
                        return this.facebookSignIn(credential, autoSignIn);
                }
                break;
        }
    },
    googleSignIn: function (credential, autoSignIn) {
        //TODO: $app.googleService.gSignIn(credential.id, autoSignIn);
    },
    facebookSignIn: function (credential, autoSignIn) {
        //TODO:  $app.facebookService.loginFacebook(autoSignIn);
    },
    pwSignIn: function (credential, autoSignIn) {
        // If `password` prop doesn't exist, this is Chrome < 60
        if (credential.password === undefined) {
            //signinApp.email = credential.id;
            // Otherwise, this is Chrome => 60
        } else {
            //TODO: $app.loginService.loginEmail({ id: credential.id, password: credential.password, provider: PASSWORD_LOGIN });
        }
    }
};