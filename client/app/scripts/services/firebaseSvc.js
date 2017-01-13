'use strict';

/**
* @ngdoc service
* @name clientApp.firebaseSvc
* @description
* # firebaseSvc
* Factory in the clientApp.
*/
angular.module('clientApp')
.factory('firebaseSvc', function ($window) {
    var instance,
        storageInstance,
        unsubscribe,
        currentUser = null;
    var initialized = false;

    return {
        initialize: function () {

            // Not initialized so... initialize Firebase
            var config = {
                apiKey: 'AIzaSyC4shLU7c2ldYdctyitLe4qmPv09H3pXk8',
                authDomain: 'cmdr-logs.firebaseapp.com',
                databaseURL: 'https://cmdr-logs.firebaseio.com',
                storageBucket: 'cmdr-logs.appspot.com',
                messagingSenderId: '375363069051'
            };

            // initialize database and storage
            instance = $window.firebase.initializeApp(config);
            storageInstance = $window.firebase.storage();

            // listen for authentication event, dont start app until I
            // get either true or false
            unsubscribe = $window.firebase.auth().onAuthStateChanged(function (user) {
                currentUser = user;
            });
        },
    };
});
