'use strict';

/**
* @ngdoc function
* @name clientApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('LoginCtrl', function (auth, currentUser, toastr, $window) {
    var vm = this;
    vm.auth = auth;
    vm.user = currentUser;
    vm.createUser = createUser;
    vm.updateUser = updateUser;
    vm.login = login;
    vm.signOutUser = signOutUser;
    vm.password = '';
    vm.userEmail = '';
    vm.newUserEmail = '';
    vm.newPassword = '';
    vm.cmdrName = '';
    vm.newCmdrName = '';

    function login() {
        vm.auth.$signInWithEmailAndPassword(vm.userEmail, vm.password).then(function(firebaseUser) {
            toastr.success('You signed in.', 'Success!');
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function createUser() {
        vm.auth.$createUserWithEmailAndPassword(vm.newUserEmail, vm.newPassword).then(function(user) {
            updateProfile(vm.cmdrName);
            toastr.success('New account created.', 'Success!');
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function updateUser() {
        updateProfile(vm.newCmdrName);
    }

    function updateProfile(cmdrNameVal) {
        var user = $window.firebase.auth().currentUser;
        user.updateProfile({
            displayName: cmdrNameVal
        }).then(function() {
            toastr.success('Updated profile.', 'Success!');
        }, function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function signOutUser() {
        vm.auth.$signOut().then(function() {
            toastr.success('You signed out.', 'Success!');
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

});
