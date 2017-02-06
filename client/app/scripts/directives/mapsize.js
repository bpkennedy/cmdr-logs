'use strict';

/**
* @ngdoc directive
* @name clientApp.directive:mapsize
* @description
* # mapsize
*/
angular.module('clientApp')
.directive('mapsize', function ($window) {
    return function (scope, element) {
        var mapData = [];
		var w = angular.element($window);
		scope.getWindowDimensions = function () {
			return { 'h': w.height(), 'w': w.width() };
		};
		scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
			scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
            scope.style = function () {
				return {
                    'height': (newValue.h) + 'px',
                    'width': (newValue.w) + 'px'
                };
			};

		}, true);


		w.bind('resize', function () {
			scope.$apply();
		});
	};
});
