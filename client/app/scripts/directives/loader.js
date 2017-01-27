'use strict';

/**
* @ngdoc directive
* @name clientApp.directive:smoke
* @description
* # smoke
*/
angular.module('clientApp').directive('loader', function spinner() {
    return {
        restrict: 'EA',
        scope: {
            title: '@'
        },
        templateUrl: '../../views/loader.html',
        controller: 'LoaderCtrl',
        controllerAs: 'vm',
        bindToController: true
    };

});


angular.module('clientApp').controller('LoaderCtrl', function loaderCtrl(loaderSvc) {
    var vm = this;
    vm.state = loaderSvc.getState;
});

angular.module('clientApp').factory('loaderSvc', function loaderSvcFunc() {
    var state = {
        isShowing: false,
        text: '',
    };

    function getState() {
        return state;
    }

    function toggleOnText(text) {
        if (text === 'undefined' || text === undefined || text === '' || text === null) {
            state.text = 'STAND BY';
        } else {
            state.text = text;
            state.isShowing = true;
        }
    }

    function toggleOff() {
        state.isShowing = false;
    }

    return {
        getState: getState,
        toggleOnText: toggleOnText,
        toggleOff: toggleOff
    };
});
