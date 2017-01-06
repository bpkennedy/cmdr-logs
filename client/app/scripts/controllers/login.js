'use strict';

/**
* @ngdoc function
* @name clientApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('LoginCtrl', function (auth, toastr) {
    var vm = this;
    vm.checkIfLoggedIn = checkIfLoggedIn;
    vm.createUser = createUser;
    vm.login = login;
    vm.signOutUser = signOutUser;
    vm.password = '';
    vm.userEmail = '';
    vm.newUserEmail = '';
    vm.newPassword = '';

    function checkIfLoggedIn() {
        auth.getCurrentUser();
    }

    function login() {
        console.log(vm.userEmail);
        console.log(vm.password);
        auth.signInUser(vm.userEmail, vm.password).then(function(response) {
            console.log('response is');
            console.log(response);
            toastr.success('You signed in.', 'Success!');
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            toastr.error(errorMessage, errorCode);
        });
    }

    function createUser() {
        auth.createUser(vm.newUserEmail, vm.newPassword).then(function(response) {
            console.log('response is');
            console.log(response);
            toastr.success('New account created.', 'Success!');
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            toastr.error(errorMessage, errorCode);
        });
    }

    function signOutUser() {
        auth.signOutUser().then(function() {
            toastr.success('You signed out.', 'Success!');
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            toastr.error(errorMessage, errorCode);
        });
    }


    this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];
});
