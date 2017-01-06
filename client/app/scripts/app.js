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
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'toastr'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state('root', {
      url: "",
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
          }
      }
    });
    $stateProvider.state('root.about', {
        url: '/about',
        data: {
            pageName: 'AboutCtrl',
            browserTitle: 'About'
        },
        views: {
            'container@': {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
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
.run(function (firebaseSvc) {
    firebaseSvc.initializeFirebase();
});
