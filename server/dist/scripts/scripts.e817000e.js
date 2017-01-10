"use strict";angular.module("clientApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.router","toastr"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("root",{url:"","abstract":!0,resolve:{},views:{"titlebar@":{templateUrl:"views/titlebar.html",controller:"TitlebarCtrl",controllerAs:"vm"}}}),a.state("root.dashboard",{url:"/",data:{pageName:"MainCtrl",browserTitle:"Main"},views:{"container@":{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"vm"},"entry@root.dashboard":{templateUrl:"views/entry.html",controller:"EntryCtrl",controllerAs:"vm"}}}),a.state("root.entry",{url:"/entries/:entryId",parent:"root",data:{pageName:"EntryCtrl",browserTitle:"Entry"},views:{"container@":{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"vm"},"entry@root.entry":{templateUrl:"views/entry.html",controller:"EntryCtrl",controllerAs:"vm"}}}),a.state("root.login",{url:"/login",data:{pageName:"LoginCtrl",browserTitle:"Login"},views:{"container@":{templateUrl:"views/login.html",controller:"LoginCtrl",controllerAs:"vm"}}})}]).run(["firebaseSvc",function(a){a.initializeFirebase()}]),angular.module("clientApp").controller("MainCtrl",["auth","$window","entries","toastr","$timeout",function(a,b,c,d,e){function f(){g()}function g(){e(function(){j.userUid=a.getCurrentUser().data.uid,i()},100)}function h(){var a={title:"This is an Orange Test",message:"An awesome example of it working, doge."};c.createEntry(a,j.userUid).then(function(){d.success("You created a new item.","Success!"),i()})["catch"](function(a){d.error(a.message,a.code)})}function i(){c.getUserEntries(j.userUid).then(function(a){var c=a.val();b._.map(c,function(a,b){a.$key=b});var d=b._.values(c)||[];e(function(){j.entries=d})})["catch"](function(a){d.error(a.message,a.code)})}var j=this;j.entries=[],j.userUid=null,j.createEntry=h,f()}]),angular.module("clientApp").factory("firebaseSvc",["$window",function(a){function b(){var a={apiKey:"AIzaSyC4shLU7c2ldYdctyitLe4qmPv09H3pXk8",authDomain:"cmdr-logs.firebaseapp.com",databaseURL:"https://cmdr-logs.firebaseio.com",storageBucket:"cmdr-logs.appspot.com",messagingSenderId:"375363069051"};firebase.initializeApp(a)}function c(){return a.firebase}return{initializeFirebase:b,getFirebase:c}}]),angular.module("clientApp").controller("LoginCtrl",["auth","toastr","$timeout",function(a,b,c){function d(){a.signInUser(i.userEmail,i.password).then(function(a){b.success("You signed in.","Success!")})["catch"](function(a){b.error(a.message,a.code)})}function e(){a.createUser(i.newUserEmail,i.newPassword).then(function(a){g(i.cmdrName),b.success("New account created.","Success!")})["catch"](function(a){b.error(a.message,a.code)})}function f(){g(i.newCmdrName)}function g(a){var c=firebase.auth().currentUser;c.updateProfile({displayName:a}).then(function(){b.success("Updated profile.","Success!")},function(a){b.error(a.message,a.code)})}function h(){a.signOutUser().then(function(){b.success("You signed out.","Success!")})["catch"](function(a){b.error(a.message,a.code)})}var i=this;i.createUser=e,i.updateUser=f,i.login=d,i.signOutUser=h,i.password="",i.userEmail="",i.newUserEmail="",i.newPassword="",i.cmdrName="",i.newCmdrName=""}]),angular.module("clientApp").factory("auth",["firebaseSvc",function(a){function b(a){a?g.user.data=a:g.user.data=null}function c(){return g.user}function d(a,b){return g.firebase.auth().createUserWithEmailAndPassword(a,b)}function e(a,b){return g.firebase.auth().signInWithEmailAndPassword(a,b)}function f(){return g.firebase.auth().signOut()}var g=this;return g.firebase=a.getFirebase(),g.user={data:null},firebase.auth().onAuthStateChanged(function(a){b(a)}),{getCurrentUser:c,createUser:d,signInUser:e,signOutUser:f}}]),angular.module("clientApp").controller("TitlebarCtrl",["auth","$timeout",function(a,b){function c(){d()}function d(){b(function(){e.user=a.getCurrentUser()},100)}var e=this;e.user=null,c()}]),angular.module("clientApp").factory("entries",["$q","$window","toastr",function(a,b,c){function d(a){return b.firebase.database().ref("/users/"+a+"/entries").once("value")}function e(a){return b.firebase.database().ref("/entries/"+a).once("value")}function f(a,d){var e=b.firebase.database().ref("/entries/"+a);return e.remove().then(function(){console.log("in here");var e=b.firebase.database().ref("/users/"+d+"/entries/"+a);return e.remove().then(function(){c.success("You deleted entry "+a,"Success!")})["catch"](function(a){c.error(a.message,a.code)})})["catch"](function(a){c.error(a.message,a.code)})}function g(a,d){var e=b.firebase.database().ref("/entries/");return e.push({title:a.title,message:a.message,created_at:(new Date).getTime(),created_by:d}).then(function(b){var c=b.key;return h(a,c,d)})["catch"](function(a){c.error(a.message,a.code)})}function h(a,c,d){var e=b.firebase.database().ref("/users/"+d+"/entries/");return e.child(c).set({title:a.title,message:a.message,created_at:(new Date).getTime(),created_by:d})}var i=this;return i.database=b.firebase.database(),{getUserEntries:d,getSingleEntry:e,createEntry:g,deleteEntry:f}}]),angular.module("clientApp").controller("EntryCtrl",["$state","$timeout","auth","$stateParams","entries","toastr",function(a,b,c,d,e,f){function g(){h()}function h(){b(function(){k.userUid=c.getCurrentUser().data.uid,j()},100)}function i(b){e.deleteEntry(b,k.userUid).then(function(){a.go("root.dashboard")})}function j(){e.getSingleEntry(k.entryKey).then(function(a){var b=a.val();k.data.key=a.key,k.data.title=b.title,k.data.message=b.message})["catch"](function(a){f.error(a.message,a.code)})}var k=this;k.entryKey=d.entryId,k.userUid=null,k.deleteEntry=i,k.data={key:"",title:"",message:""},g()}]),angular.module("clientApp").run(["$templateCache",function(a){a.put("views/entry.html",'<div class="entry-title"> <div class="star-date"> 0109 Jan 7, 3303 </div> <div class="title-text"> {{vm.data.title}} </div> </div> <div class="separator reading-separator"></div> <div class="reading-body"> {{vm.data.message}} </div> <div class="reading-actions" ng-if="vm.data.title"> <div class="new-entry edit"> Edit </div> <div class="new-entry delete" ng-click="vm.deleteEntry(vm.data.key)"> Delete </div> </div>'),a.put("views/login.html",'<div class="container"> <p>This is the login view.</p> <div class="" ng-click="vm.checkIfLoggedIn()"> Click to check if logged in. </div> <div class="" ng-click="vm.signOutUser()"> Click to sign out user. </div> <div class="well"> Click to try log in. <div class="form"> <div class="form-group"> <label for="userEmail">User Email</label> <input class="form-control" id="userEmail" type="text" name="" value="" ng-model="vm.userEmail"> </div> <div class="form-group"> <label for="password">Password</label> <input class="form-control" type="text" id="password" name="" value="" ng-model="vm.password"> </div> </div> <div class="btn btn-primary" ng-click="vm.login()"> LOGIN </div> </div> <div class="well"> Click to try creating a user. <div class="form"> <div class="form-group"> <label for="newUserEmail">New User\'s email</label> <input class="form-control" id="newUserEmail" type="text" name="" value="" ng-model="vm.newUserEmail"> </div> <div class="form-group"> <label for="newPassword">Password</label> <input class="form-control" type="text" id="newPassword" name="" value="" ng-model="vm.newPassword"> </div> <div class="form-group"> <label for="cmdrName">Commander Name</label> <input class="form-control" id="cmdrName" type="text" name="" value="" ng-model="vm.cmdrName"> </div> </div> <div class="btn btn-danger" ng-click="vm.createUser()"> LOGIN </div> </div> <div class="well"> Update your profile <div class="form"> <div class="form-group"> <label for="newCmdrName">New Commander Name</label> <input class="form-control" id="newCmdrName" type="text" name="" value="" ng-model="vm.newCmdrName"> </div> </div> <div class="btn btn-danger" ng-click="vm.updateUser()"> SAVE </div> </div> </div>'),a.put("views/main.html",'<div class="main-wrapper"> <div class="sidebar"> <div class="sidebar-title"> Journal Entries </div> <div class="separator"></div> <ul class="journal-list"> <li ng-repeat="entry in vm.entries" ui-sref="root.entry({entryId: entry.$key})"> <div class="entry-text"> {{entry.title}} </div> <div class="entry-date"> {{entry.created_at | date:\'MMM d, y\'}} </div> </li> </ul> <div class="new-entry" ng-click="vm.createEntry()"> <i class="fa fa-plus"></i> New Entry </div> </div> <div class="vertical-separator"></div> <div class="reading-pane"> <div id="entry-wrapper" ui-view="entry"></div> </div> </div>'),a.put("views/titlebar.html",'<!-- Add your site or application content here --> <div class="titlebar-wrapper"> <div class="nav-top"></div> <div class="navbar navbar-default" role="navigation"> <div class=""> <div class="navbar-header"> </div> <div class="" id=""> <ul class="nav navbar-nav"> <li ui-sref-active="active"><a ui-sref="root.dashboard">CMDR Logs</a></li> <!-- <li ui-sref-active="active"><a ui-sref="root.about">About</a></li> --> <li ng-if="!vm.user.data" ui-sref-active="active"><a ui-sref="root.login">Login</a></li> <li ng-if="vm.user.data" ui-sref-active="active"> <a ui-sref="root.login">{{vm.user.data.displayName || \'Commander\'}}</a> </li> </ul> </div> </div> </div> <div class="nav-bottom"></div> </div>')}]);