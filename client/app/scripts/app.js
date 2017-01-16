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
    'ngAudio',
    'firebase'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('root', {
        url: '',
        // Make this state abstract so it can never be
        // loaded directly
        abstract: true,
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            'currentUser': ['auth', function(auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return auth.$waitForSignIn();
            }]
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
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            'dashboard': ['auth', function(auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return auth.$requireSignIn();
            }]
        },
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
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            'entry': ['auth', function(auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return auth.$requireSignIn();
            }]
        },
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
        parent: 'root',
        params: {
            isNew: null
        },
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
.run(function (firebaseSvc, $rootScope, $state) {
    firebaseSvc.initialize();

    // for authentication, managing the state if error..
    $rootScope.$on('$stateChangeError',
    function (event, toState, toParams, fromState, fromParams, error) {

        // if the error is "NO USER" the go to login state
        if (error === 'NO USER' || error === 'AUTH_REQUIRED') {
            event.preventDefault();
            $state.go('root.login', {});
        }
    });
});
