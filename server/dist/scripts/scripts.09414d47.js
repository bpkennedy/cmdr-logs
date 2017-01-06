"use strict";angular.module("clientApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.router","toastr"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("root",{url:"","abstract":!0,resolve:{},views:{"titlebar@":{templateUrl:"views/titlebar.html",controller:"TitlebarCtrl",controllerAs:"vm"}}}),a.state("root.dashboard",{url:"/",data:{pageName:"MainCtrl",browserTitle:"Main"},views:{"container@":{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"vm"}}}),a.state("root.about",{url:"/about",data:{pageName:"AboutCtrl",browserTitle:"About"},views:{"container@":{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"vm"}}}),a.state("root.login",{url:"/login",data:{pageName:"LoginCtrl",browserTitle:"Login"},views:{"container@":{templateUrl:"views/login.html",controller:"LoginCtrl",controllerAs:"vm"}}})}]).run(["firebaseSvc",function(a){a.initializeFirebase()}]),angular.module("clientApp").controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("clientApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("clientApp").factory("firebaseSvc",["$window",function(a){function b(){var a={apiKey:"AIzaSyC4shLU7c2ldYdctyitLe4qmPv09H3pXk8",authDomain:"cmdr-logs.firebaseapp.com",databaseURL:"https://cmdr-logs.firebaseio.com",storageBucket:"cmdr-logs.appspot.com",messagingSenderId:"375363069051"};firebase.initializeApp(a)}function c(){return a.firebase}return{initializeFirebase:b,getFirebase:c}}]),angular.module("clientApp").controller("LoginCtrl",["auth","toastr",function(a,b){function c(){a.getCurrentUser()}function d(){console.log(g.userEmail),console.log(g.password),a.signInUser(g.userEmail,g.password).then(function(a){console.log("response is"),console.log(a),b.success("You signed in.","Success!")})["catch"](function(a){var c=a.code,d=a.message;b.error(d,c)})}function e(){a.createUser(g.newUserEmail,g.newPassword).then(function(a){console.log("response is"),console.log(a),b.success("New account created.","Success!")})["catch"](function(a){var c=a.code,d=a.message;b.error(d,c)})}function f(){a.signOutUser().then(function(){b.success("You signed out.","Success!")})["catch"](function(a){var c=a.code,d=a.message;b.error(d,c)})}var g=this;g.checkIfLoggedIn=c,g.createUser=e,g.login=d,g.signOutUser=f,g.password="",g.userEmail="",g.newUserEmail="",g.newPassword="",this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("clientApp").factory("auth",["firebaseSvc",function(a){function b(){f.firebase.auth().onAuthStateChanged(function(a){a?console.log("User is signed in."):console.log("No user is signed in.")})}function c(a,b){return f.firebase.auth().createUserWithEmailAndPassword(a,b)}function d(a,b){return f.firebase.auth().signInWithEmailAndPassword(a,b)}function e(){return f.firebase.auth().signOut()}var f=this;return f.firebase=a.getFirebase(),{getCurrentUser:b,createUser:c,signInUser:d,signOutUser:e}}]),angular.module("clientApp").controller("TitlebarCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("clientApp").run(["$templateCache",function(a){a.put("views/about.html",'<div class="container"> <p>This is the about view.</p> </div>'),a.put("views/login.html",'<div class="container"> <p>This is the login view.</p> <div class="" ng-click="vm.checkIfLoggedIn()"> Click to check if logged in. </div> <div class="" ng-click="vm.signOutUser()"> Click to sign out user. </div> <div class=""> Click to try log in. <div class="form"> <div class="form-group"> <label for="userEmail">User Email</label> <input class="form-control" id="userEmail" type="text" name="" value="" ng-model="vm.userEmail"> </div> <div class="form-group"> <label for="password">Password</label> <input class="form-control" type="text" id="password" name="" value="" ng-model="vm.password"> </div> </div> <div class="btn btn-primary" ng-click="vm.login()"> LOGIN </div> </div> <div class=""> Click to try creating a user. <div class="form"> <div class="form-group"> <label for="newUserEmail">New User\'s email</label> <input class="form-control" id="newUserEmail" type="text" name="" value="" ng-model="vm.newUserEmail"> </div> <div class="form-group"> <label for="newPassword">Password</label> <input class="form-control" type="text" id="newPassword" name="" value="" ng-model="vm.newPassword"> </div> </div> <div class="btn btn-danger" ng-click="vm.createUser()"> LOGIN </div> </div> </div>'),a.put("views/main.html",'<div class="container"> <div class="jumbotron"> <h1>\'Allo, \'Allo!</h1> <p class="lead"> <img src="images/yeoman.8cb970fb.png" alt="I\'m Yeoman"><br> Always a pleasure scaffolding your apps. </p> <p><a class="btn btn-lg btn-success" ng-href="#/">Splendid!<span class="glyphicon glyphicon-ok"></span></a></p> </div> <div class="row marketing"> <h4>HTML5 Boilerplate</h4> <p> HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites. </p> <h4>Angular</h4> <p> AngularJS is a toolset for building the framework most suited to your application development. </p> <h4>Karma</h4> <p>Spectacular Test Runner for JavaScript.</p> </div> </div>'),a.put("views/titlebar.html",'<!-- Add your site or application content here --> <div class=""> <div class="navbar navbar-default" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#js-navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#/">client</a> </div> <div class="collapse navbar-collapse" id="js-navbar-collapse"> <ul class="nav navbar-nav"> <li ui-sref-active="active"><a ui-sref="root.dashboard">Home</a></li> <li ui-sref-active="active"><a ui-sref="root.about">About</a></li> <li ui-sref-active="active"><a ui-sref="root.login">Login</a></li> </ul> </div> </div> </div> </div>')}]);