'use strict';

/**
* @ngdoc service
* @name clientApp.entries
* @description
* # entries
* Factory in the clientApp.
*/
angular.module('clientApp')
.factory('entries', function (auth, $firebaseObject, $window, toastr, $http) {
    var vm = this;
    vm.user = auth.$getAuth();
    vm.lastCreatedUid = {
        key: ''
    };

    function getUserEntries() {
        return $window.firebase.database().ref('users/' + vm.user.uid).child('entries');
    }

    function getSingleEntry(key) {
        return $window.firebase.database().ref('entries').child(key);
    }

    function deleteEntry(entry) {
        return entry.$remove().then(function(response) {
            var deleteUserEntryRef = $window.firebase.database().ref('/users/' + vm.user.uid + '/entries/' + entry.$id);
            var userEntryItemObj = $firebaseObject(deleteUserEntryRef);
            return userEntryItemObj.$remove();
        });
    }

    function updateEntry(entry) {
        var eliteDate = makeEliteDate();
        entry.modified_at = eliteDate;
        return entry.$save().then(function(response) {
            var userEntryRef = $window.firebase.database().ref('/users/' + vm.user.uid + '/entries/' + entry.$id);
            return userEntryRef.update({
                'title': entry.title,
                'message': entry.message,
                'modified_at': eliteDate
            });
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function createEntry(entry) {
        // Generate a reference to a new location and add some data using push()
        var newEntryRef = $window.firebase.database().ref('/entries/');
        return newEntryRef.push({
            'title': entry.title,
            'message': entry.message,
            'modified_at': makeEliteDate(),
            'created_at': makeEliteDate(),
            'created_by': vm.user.uid
        }).then(function(snapshot) {
            var newEntryId = snapshot.key;
            vm.lastCreatedUid.key = newEntryId;
            return updateUserEntries(entry, newEntryId);
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function updateUserEntries(entry, newEntryId) {
        var userRef = $window.firebase.database().ref('/users/' + vm.user.uid + '/entries/');
        return userRef.child(newEntryId).set({
            'title': entry.title,
            'message': entry.message,
            'modified_at': makeEliteDate(),
            'created_at': makeEliteDate(),
            'created_by': vm.user.uid
        });
    }

    function makeEliteDate() {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var c = new Date(year + 1286, month, day);
        return c.getTime();
    }

    function getRecentNewEntry() {
        return vm.lastCreatedUid.key;
    }

    function querySystem(keyword) {
        return $http({
            method: 'GET',
            url: 'http://beta.edsm.net:8080/typeahead/systems/query/' + keyword
        });
    }

    return {
        getUserEntries: getUserEntries,
        getSingleEntry: getSingleEntry,
        createEntry: createEntry,
        deleteEntry: deleteEntry,
        updateEntry: updateEntry,
        getRecentNewEntry: getRecentNewEntry,
        querySystem: querySystem
    };
});
