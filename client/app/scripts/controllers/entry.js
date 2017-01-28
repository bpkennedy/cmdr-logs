'use strict';

/**
* @ngdoc function
* @name clientApp.controller:EntryCtrl
* @description
* # EntryCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('EntryCtrl', function (ngAudio, $firebaseObject, $sce, $state, auth, $stateParams, entries, toastr) {
    var vm = this;
    vm.entryKey = $stateParams.entryId;
    vm.isEditMode = false;
    vm.isNew = $stateParams.isNew || false;
    vm.stateName = $state.current.name;
    vm.toggleEditMode = toggleEditMode;
    vm.deleteEntry = deleteEntry;
    vm.makeHtmlSafe = makeHtmlSafe;
    vm.saveProgress = saveProgress;
    vm.dismissConfirm = dismissConfirm;
    vm.saveAndReturn = saveAndReturn;
    vm.goBack = goBack;
    vm.toggleDelete = toggleDelete;
    vm.clickBtnSound = ngAudio.load('../sounds/buttonClick.mp3');
    vm.clickBtnHover = ngAudio.load('../sounds/buttonHover.mp3');
    vm.playSound = playSound;

    vm.data = null;
    vm.confirm = {
        show: false,
        type: '',
        message: ''
    };

    vm.tempData = {
        title: null,
        message: null
    };

    function init() {
        if (vm.stateName === 'root.entry') {
            handleNewEntryClicked();
        }
    }

    function handleNewEntryClicked() {
        if (vm.isNew) {
            toggleEditMode('new');
        } else {
            loadEntry();
        }
    }

    function dismissConfirm() {
        vm.confirm.show = false;
        vm.confirm.type = '';
        vm.confirm.message = '';
    }

    function goBack() {
        playSound('click');
        dismissConfirm();
        vm.isEditMode = !vm.isEditMode;
        vm.tempData.title = null;
        vm.tempData.message = null;
        if (vm.isNew) {
            vm.isNew = false;
            $state.go('root.dashboard', {isNew:false});
        }
    }

    function saveAndReturn() {
        if (vm.confirm.type === 'save') {
            dismissConfirm();
            vm.saveProgress();
        } else if (vm.confirm.type === 'delete') {
            dismissConfirm();
            deleteEntry();
            playSound('click');
        }
    }

    function toggleEditMode(navType) {
        if (navType === 'back') {
            if (vm.tempData.title !== vm.data.title || vm.tempData.message !== vm.data.message) {
                playSound('click');
                vm.confirm.show = true;
                vm.confirm.type = 'save';
                vm.confirm.message = 'Save your changes?';
            } else {
                goBack();
            }
        } else if (navType === 'edit') {
            playSound('click');
            vm.isEditMode = !vm.isEditMode;
            vm.tempData.title = vm.data.title;
            vm.tempData.message = vm.data.message;
        } else if (navType === 'new') {
            vm.isEditMode = !vm.isEditMode;
            vm.data = {
                isNew: true
            };
            vm.tempData.title = vm.data.title;
            vm.tempData.message = vm.data.message;
        } else if (navType === 'save') {
            playSound('click');
            vm.isEditMode = !vm.isEditMode;
            vm.tempData.title = null;
            vm.tempData.message = null;
            vm.isNew = false;
        } else {
            vm.isEditMode = !vm.isEditMode;
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

    function toggleDelete() {
        playSound('click');
        vm.confirm.show = true;
        vm.confirm.type = 'delete';
        vm.confirm.message = 'Are you sure?';
    }

    function loadEntry() {
        vm.isEditMode = false;
        vm.data = $firebaseObject(entries.getSingleEntry(vm.entryKey));
    }

    function saveProgress() {
        if (!vm.tempData.title || vm.tempData.title === '') {
            toastr.error('No Entry title', 'Required Fields');
        } else if (!vm.tempData.message || vm.tempData.message === '') {
            toastr.error('No Entry message', 'Required Fields');
        } else {
            vm.data.title = vm.tempData.title;
            vm.data.message = vm.tempData.message;
            if (vm.isNew) {
                createEntry();
            } else {
                updateEntry();
            }
        }
    }

    function createEntry() {
        playSound('click');
        entries.createEntry(vm.data).then(function(response) {
            toastr.success('You created a new item.', 'Success!');
            toggleEditMode();
            $state.go('root.dashboard');
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function updateEntry() {
        playSound('click');
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

    function playSound(type) {
        if (type === 'click') {
            vm.clickBtnSound.play();
        } else if (type === 'hover') {
            vm.clickBtnHover.play();
        }
    }

    init();
});
