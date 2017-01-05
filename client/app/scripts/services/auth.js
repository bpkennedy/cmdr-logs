'use strict';

/**
* @ngdoc service
* @name clientApp.auth
* @description
* # auth
* Factory in the clientApp.
*/
angular.module('clientApp')
.factory('auth', function (firebaseSvc) {
    var vm = this;
    vm.firebase = firebaseSvc.getFirebase();

    function getCurrentUser() {
        vm.firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('User is signed in.');
            } else {
                console.log('No user is signed in.');
            }
        });
    }

    function createUser(email, password) {
        console.log('got in here');
        return vm.firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Error creating user.  Code is ' + errorCode + '.  Message is ' + errorMessage);
        });
    }

    function signInUser(email, password) {
        return vm.firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Error signing in user.  Code is ' + errorCode + '.  Message is ' + errorMessage);
        });
    }

    function signOutUser() {
        return firebase.auth().signOut().catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Error signing in user.  Code is ' + errorCode + '.  Message is ' + errorMessage);
        });
    }

    return {
        getCurrentUser: getCurrentUser,
        createUser: createUser,
        signInUser: signInUser,
        signOutUser: signOutUser
    };
});
