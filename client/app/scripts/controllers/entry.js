'use strict';

/**
* @ngdoc function
* @name clientApp.controller:EntryCtrl
* @description
* # EntryCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('EntryCtrl', function ($rootScope, ngAudio, $firebaseObject, $sce, $state, auth, $stateParams, entries, toastr, googleAnalytics, $window) {
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
    vm.query = query;
    vm.getSystem = getSystem;
    vm.isSystemInfo = true;

    vm.data = null;
    vm.confirm = {
        show: false,
        type: '',
        message: ''
    };
    vm.info = {
        previousSystem: {
            value: ''
        },
        selectedSystemData: {
            name: '',
            information: {}
        },
        isShowing: true,
        data: {
            systems: [],
            factions: [
                {
                    color: 'EF0604',
                    name: 'Federation'
                },
                {
                    color: '08A5F2',
                    name: 'Empire'
                },
                {
                    color: '07F41C',
                    name: 'Alliance'
                },
                {
                    color: '646766',
                    name: 'None'
                }
            ]
        }
    };

    vm.tempData = {
        title: null,
        message: null,
        system: {},
        faction: {}
    };

    function init() {
        if (vm.stateName === 'root.entry') {
            handleNewEntryClicked();
        }
    }

    function getSystem() {
        if (!vm.data.system || vm.info.previousSystem !== vm.data.system.name.value) {
            entries.getSystem(vm.tempData.system.name.value).then(function(response) {
                vm.data.system = response.data;
                vm.info.previousSystem = vm.data.system.name.value;
            }).catch(function(error) {
                toastr.error(error.message, error.code);
            });
        }
    }

    function query(keyword) {
        if (keyword.length > 2) {
            entries.querySystem(keyword).then(function(response) {
                vm.info.data.systems = response.data;
            }).catch(function(error) {
                toastr.error(error.message, error.code);
            });
        } else {
            vm.info.data.systems = [];
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
            googleAnalytics.trackEvent('Entry Page', 'Deleted entry');
            refreshMap();
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
            vm.data.faction = {
                name: vm.tempData.faction.name || '',
                color: vm.tempData.faction.color || ''
            };
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
            googleAnalytics.trackEvent('Entry Page', 'Created new entry');
            refreshMap();
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
            googleAnalytics.trackEvent('Entry Page', 'Updated entry');
            refreshMap();
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

    function refreshMap() {
        //tells the galaxy map directive to rebuild its entrie coordinates and categories
        $rootScope.$broadcast('refresh-map');
    }

    init();
});
