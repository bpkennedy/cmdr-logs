'use strict';

/**
* @ngdoc service
* @name clientApp.auth
* @description
* # auth
* Factory in the clientApp.
*/
angular.module('clientApp')
.factory('auth', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
        someMethod: function () {
            return meaningOfLife;
        }
    };
});
