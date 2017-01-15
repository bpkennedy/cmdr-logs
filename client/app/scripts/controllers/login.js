'use strict';

/**
* @ngdoc function
* @name clientApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('LoginCtrl', function ($state, auth, toastr, $window) {
    var vm = this;
    vm.auth = auth;
    vm.user = auth.$getAuth();
    vm.submitForm = submitForm;
    vm.createUser = createUser;
    vm.updateUser = updateUser;
    vm.login = login;
    vm.signOutUser = signOutUser;
    vm.password = '';
    vm.userEmail = '';
    vm.newUserEmail = '';
    vm.newPassword = '';
    vm.confirmPassword = '';
    vm.cmdrName = '';
    vm.newCmdrName = '';

    function submitForm(isValid) {
        if (isValid) {
            login();
        }
    }

    function login() {
        vm.auth.$signInWithEmailAndPassword(vm.userEmail, vm.password).then(function(firebaseUser) {
            vm.user = auth.$getAuth();
            var name = vm.user.displayName || vm.user.email;
            $state.go('root.dashboard', {isNew:false});
            toastr.success('Welcome back ' + name, 'Yo!');
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

    function updateUser(isValid) {
        if (isValid) {
            updateProfile(vm.newCmdrName);
        }
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
        vm.auth.$signOut().then(function(firebaseUser) {
            vm.user = firebaseUser;
            toastr.success('You signed out.', 'Success!');
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

});
