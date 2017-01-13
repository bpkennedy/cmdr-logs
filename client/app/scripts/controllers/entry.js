'use strict';

/**
* @ngdoc function
* @name clientApp.controller:EntryCtrl
* @description
* # EntryCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('EntryCtrl', function ($rootScope, $sce, $state, $timeout, auth, $stateParams, entries, toastr) {
    var vm = this;
    vm.entryKey = $stateParams.entryId;
    vm.userUid = null;
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
        setUserUid();
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

    function setUserUid() {
        $timeout(function(){
           vm.userUid = auth.getCurrentUser().data.uid;
           if (vm.stateName === 'root.entry') {
               loadEntry();
               handleNewEntryClicked();
           }
       }, 100);
    }

    function deleteEntry(entryKey) {
        entries.deleteEntry(entryKey, vm.userUid).then(function() {
            $state.go('root.dashboard');
        });
    }

    function loadEntry() {
        vm.isEditMode = false;
        entries.getSingleEntry(vm.entryKey).then(function(snapshot) {
            var response = snapshot.val();
            var createdAt = buildEliteDate(response.created_at);
            $timeout(function() {
                vm.data.key = snapshot.key;
                vm.data.title = response.title;
                vm.data.message = makeHtmlSafe(response.message);
                vm.data.date = createdAt;
            });
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function buildEliteDate(time) {
        var milliseconds = parseInt(time);
        var newDate = new Date(milliseconds);
        return newDate;

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
        entries.createEntry(vm.data, vm.userUid).then(function(response) {
            toastr.success('You created a new item.', 'Success!');
            toggleEditMode();
            getEntriesEmit();
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function updateEntry() {
        entries.updateEntry(vm.data, vm.userUid).then(function(response) {
            toastr.success('You updated entry ' + vm.data.key, 'Success!');
            toggleEditMode();
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function getEntriesEmit() {
        var itemId = entries.getRecentNewEntry();
        $rootScope.$emit('getEntries', itemId);
    }

    function makeHtmlSafe(string) {
        var safeString = $sce.trustAsHtml(string);
        return safeString;
    }

    init();
});
