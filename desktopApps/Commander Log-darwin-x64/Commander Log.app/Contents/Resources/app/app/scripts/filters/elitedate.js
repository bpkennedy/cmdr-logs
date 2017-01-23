'use strict';

/**
* @ngdoc filter
* @name clientApp.filter:eliteDate
* @function
* @description
* # eliteDate
* Filter in the clientApp.
*/
angular.module('clientApp')
.filter('eliteDate', function ($filter) {
    var angularDateFilter = $filter('date');
    return function(theDate) {
       return angularDateFilter(theDate, 'MMM d, y');
   };
});
