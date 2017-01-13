'use strict';

/**
* @ngdoc service
* @name clientApp.auth
* @description
* # auth
* Factory in the clientApp.
*/
angular.module('clientApp')
.factory('auth', function ($firebaseAuth) {
    return $firebaseAuth();
});
