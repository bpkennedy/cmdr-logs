'use strict';

/**
* @ngdoc overview
* @name clientApp
* @description
* # clientApp
*
* Main module of the application.
*/
angular
.module('clientApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngTouch',
    'ui.router',
    'textAngular',
    'toastr',
    'ngAudio'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('root', {
      url: '',
      // Make this state abstract so it can never be
      // loaded directly
      abstract: true,
      resolve: {
      },
      views: {
          'titlebar@': {
              templateUrl: 'views/titlebar.html',
              controller: 'TitlebarCtrl',
              controllerAs: 'vm'
          },
      }
    });
    $stateProvider.state('root.dashboard', {
      url: '/',
      data: {
          pageName: 'MainCtrl',
          browserTitle: 'Main'
      },
      views: {
          'container@': {
              templateUrl: 'views/main.html',
              controller: 'MainCtrl',
              controllerAs: 'vm'
          },
          'entry@root.dashboard': {
              templateUrl: 'views/entry.html',
              controller: 'EntryCtrl',
              controllerAs: 'vm'
          }
      }
    });
    $stateProvider.state('root.entry', {
      url: '/entries/:entryId',
      parent: 'root',
      params: {
          isNew: null
      },
      data: {
          pageName: 'EntryCtrl',
          browserTitle: 'Entry'
      },
      views: {
          'container@': {
              templateUrl: 'views/main.html',
              controller: 'MainCtrl',
              controllerAs: 'vm'
          },
          'entry@root.entry': {
              templateUrl: 'views/entry.html',
              controller: 'EntryCtrl',
              controllerAs: 'vm'
          }
      }
    });
    $stateProvider.state('root.login', {
        url: '/login',
        data: {
            pageName: 'LoginCtrl',
            browserTitle: 'Login'
        },
        views: {
            'container@': {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            }
        }
    });
})
.config(function($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) {
        taOptions.toolbar = [
            ['bold', 'italics', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'h1', 'h2', 'h3', 'p', 'pre', 'html', 'insertImage','insertLink', 'insertVideo'],
            // ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            // ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
        ];
        return taOptions;
    }]);
})
.run(function (firebaseSvc) {
    firebaseSvc.initializeFirebase();
});
