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
    vm.makeHtmlSafe = makeHtmlSafe;
    vm.updateEntry = updateEntry;

    vm.data = {
        key: '',
        title: '',
        message: ''
    };

    vm.tempData = {
        title: '',
        message: ''
    };

    function init() {
        setUserUid();
    }

    function toggleEditMode(navType) {
        vm.isEditMode = !vm.isEditMode;
        if (navType === 'back') {
            vm.tempData.title = '';
            vm.tempData.message = '';
        } else if (navType === 'edit') {
            vm.tempData.title = vm.data.title;
            vm.tempData.message = vm.data.message;
        }
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
            vm.data.message = makeHtmlSafe(response.message);
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function updateEntry() {
        vm.data.title = vm.tempData.title;
        vm.data.message = vm.tempData.message;
        entries.updateEntry(vm.data, vm.userUid).then(function(response) {
            toastr.success('You updated entry ' + vm.data.key, 'Success!');
            toggleEditMode();
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function makeHtmlSafe(string) {
        var safeString = $sce.trustAsHtml(string);
        return safeString;
    }

    init();
});
