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
    vm.user = {
        data: null
    };

    firebase.auth().onAuthStateChanged(function(user) {
        updateUser(user)
    });

    function updateUser(user) {
        if (user) {
            vm.user.data = user;
        } else {
            vm.user.data = null;
        }
    }

    function getCurrentUser() {
        return vm.user;
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
