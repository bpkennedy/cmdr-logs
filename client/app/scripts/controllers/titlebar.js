'use strict';

/**
* @ngdoc function
* @name clientApp.controller:TitlebarCtrl
* @description
* # TitlebarCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('TitlebarCtrl', function (auth, $state, currentUser, $timeout) {
    var vm = this;
    vm.auth = auth;
    vm.user = auth.$getAuth();
    vm.isEntry = isEntry;

    vm.auth.$onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) {
            vm.user = firebaseUser;
        } else {
            vm.user = null;
        }
    });

    function isEntry() {
        var state = $state.current.name;
        if (state === 'root.entry' || state === 'root.dashboard') {
            return true;
        } else {
            return false;
        }
    }

});
