'use strict';

/**
* @ngdoc function
* @name clientApp.controller:TitlebarCtrl
* @description
* # TitlebarCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('TitlebarCtrl', function ($state, auth, $timeout) {
    var vm = this;
    vm.user = null;
    vm.isEntry = isEntry;

    function init() {
        checkIfLoggedIn();
    }

    function isEntry() {
        var state = $state.current.name;
        if (state === 'root.entry' || state === 'root.dashboard') {
            return true;
        } else {
            return false;
        }
    }

    function checkIfLoggedIn() {
        $timeout(function() {
            vm.user = auth.getCurrentUser();
        }, 100);
    }

    init();
});
