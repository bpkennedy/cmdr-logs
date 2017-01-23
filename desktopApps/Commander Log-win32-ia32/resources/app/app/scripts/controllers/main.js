'use strict';

/**
* @ngdoc function
* @name clientApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('MainCtrl', function (ngAudio, $firebaseArray, $location, $state, entries, toastr, $timeout) {
    var vm = this;
    vm.entries = [];
    vm.goToNewEntry = goToNewEntry;
    vm.clickBtnSound = ngAudio.load('../sounds/buttonClick.mp3');
    vm.clickBtnHover = ngAudio.load('../sounds/buttonHover.mp3');
    vm.playSound = playSound;

    function init() {
        getEntries();
    }

    function goToNewEntry() {
        playSound('click');
        $state.go('root.entry', {isNew:true});
        $timeout(function() {
            $location.path('/entries/new').replace().notify(false);
        }, 100);
    }

    function getEntries() {
        vm.entries = $firebaseArray(entries.getUserEntries());
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
