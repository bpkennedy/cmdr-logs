'use strict';

/**
* @ngdoc function
* @name clientApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('MainCtrl', function ($firebaseArray, $location, $state, entries, toastr, $timeout) {
    var vm = this;
    vm.entries = [];
    vm.goToNewEntry = goToNewEntry;

    function init() {
        getEntries();
    }

    function goToNewEntry() {
        $state.go('root.entry', {isNew:true});
        $timeout(function() {
            $location.path('/entries/new').replace().notify(false);
        }, 100);
    }

    function getEntries() {
        vm.entries = $firebaseArray(entries.getUserEntries());
    }

    init();
});
