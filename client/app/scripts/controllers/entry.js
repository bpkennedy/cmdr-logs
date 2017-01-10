'use strict';

/**
* @ngdoc function
* @name clientApp.controller:EntryCtrl
* @description
* # EntryCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('EntryCtrl', function ($sce, $state, $timeout, auth, $stateParams, entries, toastr) {
    var vm = this;
    vm.entryKey = $stateParams.entryId;
    vm.userUid = null;
    vm.isEditMode = false;
    vm.toggleEditMode = toggleEditMode;
    vm.deleteEntry = deleteEntry;

    vm.data = {
        key: '',
        title: '',
        message: ''
    };

    function init() {
        setUserUid();
    }

    function toggleEditMode() {
        vm.isEditMode = !vm.isEditMode;
    }

    function setUserUid() {
        $timeout(function(){
           vm.userUid = auth.getCurrentUser().data.uid;
           if ($state.current.name === 'root.entry') {
               loadEntry();
           }
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
            vm.data.message = $sce.trustAsHtml(response.message);
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    init();
});
