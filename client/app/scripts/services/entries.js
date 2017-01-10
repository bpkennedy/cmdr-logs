'use strict';

/**
* @ngdoc service
* @name clientApp.entries
* @description
* # entries
* Factory in the clientApp.
*/
angular.module('clientApp')
.factory('entries', function ($q, $window, toastr) {
    var vm = this;
    vm.database = $window.firebase.database();

    function getUserEntries(uid) {
        return $window.firebase.database().ref('/users/' + uid + '/entries').once('value');
    }

    function getSingleEntry(key) {
        return $window.firebase.database().ref('/entries/' + key).once('value');
    }

    function deleteEntry(key, uid) {
        var deleteEntryRef = $window.firebase.database().ref('/entries/' + key);
        return deleteEntryRef.remove().then(function() {
            console.log('in here');
            var deleteUserEntryRef = $window.firebase.database().ref('/users/' + uid + '/entries/' + key);
            return deleteUserEntryRef.remove().then(function() {
                toastr.success('You deleted entry ' + key, 'Success!');
            }).catch(function(error) {
                toastr.error(error.message, error.code);
            });
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }

    function updateEntry(data, uid) {
        var entryRef = $window.firebase.database().ref('/entries/' + data.key);
        return entryRef.update({
            'title': data.title,
            'message': data.message
        }).then(function(snapshot) {
            var userEntryRef = $window.firebase.database().ref('/users/' + uid + '/entries/' + data.key);
            return userEntryRef.update({
                'title': data.title,
                'message': data.message
            });
        }).catch(function(error) {
            toastr.error(error.message, error.code);
        });
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
        }).catch(function(error) {
            toastr.error(error.message, error.code);
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
        createEntry: createEntry,
        deleteEntry: deleteEntry,
        updateEntry: updateEntry
    };
});
