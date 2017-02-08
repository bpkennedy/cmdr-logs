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
    vm.loadMap = false;
    vm.isEntry = isEntry;
    vm.isMap = isMap;
    vm.ifMapLoaded = ifMapLoaded;

    vm.auth.$onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) {
            vm.user = firebaseUser;
            vm.loadMap = true;
        } else {
            vm.user = null;
        }
    });

    function ifMapLoaded() {
        if (vm.loadMap) {
            $state.go('root.map', {isNew:false});
        }
    }

    function isEntry() {
        var state = $state.current.name;
        if (state === 'root' || state === 'root.entry' || state === 'root.dashboard') {
            return true;
        } else {
            return false;
        }
    }

    function isMap() {
        var state = $state.current.name;
        if (state === 'root.map') {
            return true;
        } else {
            return false;
        }
    }

});
