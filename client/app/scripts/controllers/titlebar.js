'use strict';

/**
* @ngdoc function
* @name clientApp.controller:TitlebarCtrl
* @description
* # TitlebarCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('TitlebarCtrl', function ($state, currentUser, $timeout) {
    var vm = this;
    vm.user = currentUser;
    vm.isEntry = isEntry;

    function isEntry() {
        var state = $state.current.name;
        if (state === 'root.entry' || state === 'root.dashboard') {
            return true;
        } else {
            return false;
        }
    }

});
