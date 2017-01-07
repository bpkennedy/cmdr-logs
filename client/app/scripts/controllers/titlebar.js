'use strict';

/**
* @ngdoc function
* @name clientApp.controller:TitlebarCtrl
* @description
* # TitlebarCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('TitlebarCtrl', function (auth, $timeout) {
    var vm = this;
    vm.user = null;

    function init() {
        checkIfLoggedIn();
    }

    function checkIfLoggedIn() {
        $timeout(function() {
            vm.user = auth.getCurrentUser();
        }, 100);
    }

    init();
});
