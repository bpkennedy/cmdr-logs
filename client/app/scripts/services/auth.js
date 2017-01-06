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
        return vm.firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    function signInUser(email, password) {
        return vm.firebase.auth().signInWithEmailAndPassword(email, password);
    }

    function signOutUser() {
        return vm.firebase.auth().signOut();
    }

    return {
        getCurrentUser: getCurrentUser,
        createUser: createUser,
        signInUser: signInUser,
        signOutUser: signOutUser
    };
});
