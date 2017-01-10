'use strict';

/**
* @ngdoc function
* @name clientApp.controller:EntryCtrl
* @description
* # EntryCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('EntryCtrl', function ($state, $timeout, auth, $stateParams, entries, toastr) {
    var vm = this;
    vm.entryKey = $stateParams.entryId;
    vm.userUid = null;
    vm.deleteEntry = deleteEntry;

    vm.data = {
        key: '',
        title: '',
        message: ''
    };

    function init() {
        setUserUid();
    }

    function setUserUid() {
        $timeout(function(){
           vm.userUid = auth.getCurrentUser().data.uid;
           loadEntry();
       }, 100);
    }

    function deleteEntry(entryKey) {

        entries.deleteEntry(entryKey, vm.userUid).then(function() {
            $state.go('root.dashboard');
        });
    }

    function loadEntry() {
        entries.getSingleEntry(vm.entryKey).then(function(snapshot) {
            var response = snapshot.val();
            vm.data.key = snapshot.key;
            vm.data.title = response.title;
            vm.data.message = response.message;
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    init();
});
