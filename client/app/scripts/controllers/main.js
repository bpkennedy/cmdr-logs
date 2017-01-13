'use strict';

/**
* @ngdoc function
* @name clientApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the clientApp
*/
angular.module('clientApp')
.controller('MainCtrl', function ($rootScope, $location, $state, auth, $window, entries, toastr, $timeout) {
    var vm = this;
    vm.entries = [];
    vm.userUid = null;
    vm.goToNewEntry = goToNewEntry;

    function init() {
        setUserUid();
    }

    function setUserUid() {
        $timeout(function(){
            vm.userUid = auth.getCurrentUser().data.uid;
            getEntries();
        }, 100);
    }

    function goToNewEntry() {
        $state.go('root.entry', {isNew:true});
        $timeout(function() {
            $location.path('/entries/new').replace().notify(false);
        }, 100);
    }

    function getEntries() {
        entries.getUserEntries(vm.userUid).then(function(response) {
            $timeout(function() {
                var rawEntries = response.val();
                $window._.map(rawEntries, function(val, key) {
                    val.$key = key;
                });
                var arrayEntries = $window._.values(rawEntries) || [];
                vm.entries = arrayEntries;
            });
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    init();

    $rootScope.$on('getEntries', function (event, data) {
        getEntries();
        $state.go('root.entry', {entryId: data, isNew: false});
    });
});
