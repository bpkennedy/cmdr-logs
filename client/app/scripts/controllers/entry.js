'use strict';

/**
* @ngdoc function
* @name clientApp.controller:EntryCtrl
* @description
* # EntryCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('EntryCtrl', function ($stateParams, entries, toastr) {
    var vm = this;
    vm.entryKey = $stateParams.entryId;

    vm.data = {
        title: '',
        message: ''
    };

    function init() {
        loadEntry();
    }

    function loadEntry() {
        entries.getSingleEntry(vm.entryKey).then(function(snapshot) {
            var response = snapshot.val();
            vm.data.title = response.title;
            vm.data.message = response.message;
        }).catch(function(error) {
            console.log(error);
            toastr.error(error.message, error.code);
        });
    }
    this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];

    init();
});
