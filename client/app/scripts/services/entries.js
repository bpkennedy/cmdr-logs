'use strict';

/**
* @ngdoc service
* @name clientApp.entries
* @description
* # entries
* Factory in the clientApp.
*/
angular.module('clientApp')
.factory('entries', function ($q, $window) {
    var vm = this;
    vm.database = $window.firebase.database();

    function getUserEntries(uid) {
        return $window.firebase.database().ref('/users/' + uid + '/entries').once('value');
    }

    function getSingleEntry(key) {
        return $window.firebase.database().ref('/entries/' + key).once('value');
    }

    function createEntry(entry, uid) {
        // Generate a reference to a new location and add some data using push()
        var newEntryRef = $window.firebase.database().ref('/entries/');
        return newEntryRef.push({
            'title': entry.title,
            'message': entry.message,
            'created_at': new Date().getTime(),
            'created_by': uid
        }).then(function(snapshot) {
            var newEntryId = snapshot.key;
            return updateUserEntries(entry, newEntryId, uid);
        });
    }

    function updateUserEntries(entry, newEntryId, uid) {
        var userRef = $window.firebase.database().ref('/users/' + uid + '/entries/');
        return userRef.child(newEntryId).set({
            'title': entry.title,
            'message': entry.message,
            'created_at': new Date().getTime(),
            'created_by': uid
        });
    }

    return {
        getUserEntries: getUserEntries,
        getSingleEntry: getSingleEntry,
        createEntry: createEntry
    };
});
