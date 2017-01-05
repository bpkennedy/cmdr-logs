'use strict';

/**
* @ngdoc function
* @name clientApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('LoginCtrl', function (auth) {
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
        });
    }

    function createUser() {
        console.log('called func');
        auth.createUser(vm.newUserEmail, vm.newPassword).then(function(response) {
            console.log('response is');
            console.log(response);
        });
    }

    function signOutUser() {
        auth.signOutUser().then(function() {
            console.log('signed out now');
        });
    }


    this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];
});
