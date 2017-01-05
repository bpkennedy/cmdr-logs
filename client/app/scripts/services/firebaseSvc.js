'use strict';

/**
* @ngdoc service
* @name clientApp.firebaseSvc
* @description
* # firebaseSvc
* Factory in the clientApp.
*/
angular.module('clientApp')
.factory('firebaseSvc', function () {

    function initializeFirebase() {
        var config = {
            apiKey: "AIzaSyC4shLU7c2ldYdctyitLe4qmPv09H3pXk8",
            authDomain: "cmdr-logs.firebaseapp.com",
            databaseURL: "https://cmdr-logs.firebaseio.com",
            storageBucket: "cmdr-logs.appspot.com",
            messagingSenderId: "375363069051"
        };
        firebase.initializeApp(config);
    }

    return {
        initializeFirebase: initializeFirebase
    };
});
