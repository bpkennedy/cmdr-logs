'use strict';

/**
* @ngdoc function
* @name clientApp.controller:EntryCtrl
* @description
* # EntryCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('EntryCtrl', function ($firebaseObject, $sce, $state, auth, $stateParams, entries, toastr) {
    var vm = this;
    vm.entryKey = $stateParams.entryId;
    vm.isEditMode = false;
    vm.isNew = $stateParams.isNew || false;
    vm.stateName = $state.current.name;
    vm.toggleEditMode = toggleEditMode;
    vm.deleteEntry = deleteEntry;
    vm.makeHtmlSafe = makeHtmlSafe;
    vm.saveProgress = saveProgress;

    vm.data = {
        key: '',
        title: '',
        message: '',
        date: ''
    };

    vm.tempData = {
        title: null,
        message: null
    };

    function init() {
        if (vm.stateName === 'root.entry') {
            loadEntry();
            handleNewEntryClicked();
        }
    }

    function handleNewEntryClicked() {
        if (vm.isNew) {
            toggleEditMode('new');
        }
    }

    function toggleEditMode(navType) {
        vm.isEditMode = !vm.isEditMode;
        if (navType === 'back') {
            vm.tempData.title = null;
            vm.tempData.message = null;
        } else if (navType === 'edit') {
            vm.tempData.title = vm.data.title;
            vm.tempData.message = vm.data.message;
        } else if (navType === 'new') {
            vm.tempData.title = makeHtmlSafe('Entry Title Here..');
            vm.tempData.message = makeHtmlSafe('<div style="font-style:italics;">The body of your entry here...</div>');
        } else if (navType === 'save') {
            vm.tempData.title = null;
            vm.tempData.message = null;
            vm.isNew = false;
        }
    }

    function deleteEntry() {
        var deletedItemKey = vm.data.$id;
        entries.deleteEntry(vm.data).then(function(response) {
            toastr.success('You deleted entry ' + deletedItemKey, 'Success!');
            $state.go('root.dashboard');
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function loadEntry() {
        vm.isEditMode = false;
        vm.data = $firebaseObject(entries.getSingleEntry(vm.entryKey));
    }

    function saveProgress() {
        vm.data.title = vm.tempData.title;
        vm.data.message = vm.tempData.message;
        if (vm.isNew) {
            createEntry();
        } else {
            updateEntry();
        }
    }

    function createEntry() {
        entries.createEntry(vm.data).then(function(response) {
            toastr.success('You created a new item.', 'Success!');
            toggleEditMode();
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function updateEntry() {
        entries.updateEntry(vm.data).then(function(response) {
            toastr.success('You updated entry ' + vm.data.$id, 'Success!');
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
