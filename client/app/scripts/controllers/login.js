'use strict';

/**
* @ngdoc function
* @name clientApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('LoginCtrl', function (auth, toastr, $timeout) {
    var vm = this;
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
        auth.signInUser(vm.userEmail, vm.password).then(function(response) {
            toastr.success('You signed in.', 'Success!');
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function createUser() {
        auth.createUser(vm.newUserEmail, vm.newPassword).then(function(user) {
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
        var user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: cmdrNameVal
        }).then(function() {
            toastr.success('Updated profile.', 'Success!');
        }, function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function signOutUser() {
        auth.signOutUser().then(function() {
            toastr.success('You signed out.', 'Success!');
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

});
