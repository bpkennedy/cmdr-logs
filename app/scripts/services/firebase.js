'use strict';

/**
 * @ngdoc service
 * @name commanderLogApp.firebase
 * @description
 * # firebase
 * Factory in the commanderLogApp.
 */
angular.module('commanderLogApp')
  .factory('firebase', function () {
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
