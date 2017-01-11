"use strict";angular.module("clientApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngTouch","ui.router","textAngular","toastr"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("root",{url:"","abstract":!0,resolve:{},views:{"titlebar@":{templateUrl:"views/titlebar.html",controller:"TitlebarCtrl",controllerAs:"vm"}}}),a.state("root.dashboard",{url:"/",data:{pageName:"MainCtrl",browserTitle:"Main"},views:{"container@":{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"vm"},"entry@root.dashboard":{templateUrl:"views/entry.html",controller:"EntryCtrl",controllerAs:"vm"}}}),a.state("root.entry",{url:"/entries/:entryId",parent:"root",params:{isNew:null},data:{pageName:"EntryCtrl",browserTitle:"Entry"},views:{"container@":{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"vm"},"entry@root.entry":{templateUrl:"views/entry.html",controller:"EntryCtrl",controllerAs:"vm"}}}),a.state("root.login",{url:"/login",data:{pageName:"LoginCtrl",browserTitle:"Login"},views:{"container@":{templateUrl:"views/login.html",controller:"LoginCtrl",controllerAs:"vm"}}})}]).config(["$provide",function(a){a.decorator("taOptions",["taRegisterTool","$delegate",function(a,b){return b.toolbar=[["bold","italics","underline","justifyLeft","justifyCenter","justifyRight","h1","h2","h3","p","pre","html","insertImage","insertLink","insertVideo"]],b}])}]).run(["firebaseSvc",function(a){a.initializeFirebase()}]),angular.module("clientApp").controller("MainCtrl",["$rootScope","$location","$state","auth","$window","entries","toastr","$timeout",function(a,b,c,d,e,f,g,h){function i(){j()}function j(){h(function(){m.userUid=d.getCurrentUser().data.uid,l()},100)}function k(){c.go("root.entry",{isNew:!0}),h(function(){b.path("/entries/new").replace().notify(!1)},100)}function l(){f.getUserEntries(m.userUid).then(function(a){var b=a.val();e._.map(b,function(a,b){a.$key=b});var c=e._.values(b)||[];h(function(){m.entries=c})})["catch"](function(a){g.error(a.message,a.code)})}var m=this;m.entries=[],m.userUid=null,m.goToNewEntry=k,i(),a.$on("getEntries",function(a,b){l(),c.go("root.entry",{entryId:b,isNew:!1})})}]),angular.module("clientApp").factory("firebaseSvc",["$window",function(a){function b(){var a={apiKey:"AIzaSyC4shLU7c2ldYdctyitLe4qmPv09H3pXk8",authDomain:"cmdr-logs.firebaseapp.com",databaseURL:"https://cmdr-logs.firebaseio.com",storageBucket:"cmdr-logs.appspot.com",messagingSenderId:"375363069051"};firebase.initializeApp(a)}function c(){return a.firebase}return{initializeFirebase:b,getFirebase:c}}]),angular.module("clientApp").controller("LoginCtrl",["auth","toastr","$timeout",function(a,b,c){function d(){a.signInUser(i.userEmail,i.password).then(function(a){b.success("You signed in.","Success!")})["catch"](function(a){b.error(a.message,a.code)})}function e(){a.createUser(i.newUserEmail,i.newPassword).then(function(a){g(i.cmdrName),b.success("New account created.","Success!")})["catch"](function(a){b.error(a.message,a.code)})}function f(){g(i.newCmdrName)}function g(a){var c=firebase.auth().currentUser;c.updateProfile({displayName:a}).then(function(){b.success("Updated profile.","Success!")},function(a){b.error(a.message,a.code)})}function h(){a.signOutUser().then(function(){b.success("You signed out.","Success!")})["catch"](function(a){b.error(a.message,a.code)})}var i=this;i.createUser=e,i.updateUser=f,i.login=d,i.signOutUser=h,i.password="",i.userEmail="",i.newUserEmail="",i.newPassword="",i.cmdrName="",i.newCmdrName=""}]),angular.module("clientApp").factory("auth",["firebaseSvc",function(a){function b(a){a?g.user.data=a:g.user.data=null}function c(){return g.user}function d(a,b){return g.firebase.auth().createUserWithEmailAndPassword(a,b)}function e(a,b){return g.firebase.auth().signInWithEmailAndPassword(a,b)}function f(){return g.firebase.auth().signOut()}var g=this;return g.firebase=a.getFirebase(),g.user={data:null},firebase.auth().onAuthStateChanged(function(a){b(a)}),{getCurrentUser:c,createUser:d,signInUser:e,signOutUser:f}}]),angular.module("clientApp").controller("TitlebarCtrl",["$state","auth","$timeout",function(a,b,c){function d(){f()}function e(){var b=a.current.name;return"root.entry"===b||"root.dashboard"===b?!0:!1}function f(){c(function(){g.user=b.getCurrentUser()},100)}var g=this;g.user=null,g.isEntry=e,d()}]),angular.module("clientApp").factory("entries",["$q","$window","toastr",function(a,b,c){function d(a){return b.firebase.database().ref("/users/"+a+"/entries").once("value")}function e(a){return b.firebase.database().ref("/entries/"+a).once("value")}function f(a,d){var e=b.firebase.database().ref("/entries/"+a);return e.remove().then(function(){var e=b.firebase.database().ref("/users/"+d+"/entries/"+a);return e.remove().then(function(){c.success("You deleted entry "+a,"Success!")})["catch"](function(a){c.error(a.message,a.code)})})["catch"](function(a){c.error(a.message,a.code)})}function g(a,d){var e=b.firebase.database().ref("/entries/"+a.key);return e.update({title:a.title,message:a.message}).then(function(c){var e=b.firebase.database().ref("/users/"+d+"/entries/"+a.key);return e.update({title:a.title,message:a.message})})["catch"](function(a){c.error(a.message,a.code)})}function h(a,d){var e=b.firebase.database().ref("/entries/");return e.push({title:a.title,message:a.message,created_at:j(),created_by:d}).then(function(b){var c=b.key;return l.lastCreatedUid.key=c,i(a,c,d)})["catch"](function(a){c.error(a.message,a.code)})}function i(a,c,d){var e=b.firebase.database().ref("/users/"+d+"/entries/");return e.child(c).set({title:a.title,message:a.message,created_at:j(),created_by:d})}function j(){var a=new Date,b=a.getFullYear(),c=a.getMonth(),d=a.getDate(),e=new Date(b+1286,c,d);return e.getTime()}function k(){return l.lastCreatedUid.key}var l=this;return l.database=b.firebase.database(),l.lastCreatedUid={key:""},{getUserEntries:d,getSingleEntry:e,createEntry:h,deleteEntry:f,updateEntry:g,getRecentNewEntry:k}}]),angular.module("clientApp").controller("EntryCtrl",["$rootScope","$sce","$state","$timeout","auth","$stateParams","entries","toastr",function(a,b,c,d,e,f,g,h){function i(){l()}function j(){u.isNew&&k("new")}function k(a){u.isEditMode=!u.isEditMode,"back"===a?(u.tempData.title=null,u.tempData.message=null):"edit"===a?(u.tempData.title=u.data.title,u.tempData.message=u.data.message):"new"===a?(u.tempData.title=t("Entry Title Here.."),u.tempData.message=t('<div style="font-style:italics;">The body of your entry here...</div>')):"save"===a&&(u.tempData.title=null,u.tempData.message=null,u.isNew=!1)}function l(){d(function(){u.userUid=e.getCurrentUser().data.uid,"root.entry"===u.stateName&&(n(),j())},100)}function m(a){g.deleteEntry(a,u.userUid).then(function(){c.go("root.dashboard")})}function n(){u.isEditMode=!1,g.getSingleEntry(u.entryKey).then(function(a){var b=a.val(),c=o(b.created_at);u.data.key=a.key,u.data.title=b.title,u.data.message=t(b.message),u.data.date=c})["catch"](function(a){h.error(a.message,a.code)})}function o(a){var b=parseInt(a),c=new Date(b);return c}function p(){u.data.title=u.tempData.title,u.data.message=u.tempData.message,u.isNew?q():r()}function q(){g.createEntry(u.data,u.userUid).then(function(a){h.success("You created a new item.","Success!"),k(),s()})["catch"](function(a){h.error(a.message,a.code)})}function r(){g.updateEntry(u.data,u.userUid).then(function(a){h.success("You updated entry "+u.data.key,"Success!"),k()})["catch"](function(a){h.error(a.message,a.code)})}function s(){var b=g.getRecentNewEntry();a.$emit("getEntries",b)}function t(a){var c=b.trustAsHtml(a);return c}var u=this;u.entryKey=f.entryId,u.userUid=null,u.isEditMode=!1,u.isNew=f.isNew||!1,u.stateName=c.current.name,u.toggleEditMode=k,u.deleteEntry=m,u.makeHtmlSafe=t,u.saveProgress=p,u.data={key:"",title:"",message:"",date:""},u.tempData={title:null,message:null},i()}]),angular.module("clientApp").directive("smoke",function(){return{template:'<div id="smoke-wrapper"></div>',restrict:"E",link:function(a,b,c){function d(){var a;$(window).on("resize",function(b){clearTimeout(a),a=setTimeout(function(){e();var a=$("<canvas/>",{id:"myCanvas",height:$(window).height(),width:$(window).width()});$("#smoke-wrapper").prepend(a),f()},250)})}function e(){$("canvas").remove(),clearInterval(window.drawInterval)}function f(){function a(a){this.x=0,this.y=0,this.xVelocity=0,this.yVelocity=0,this.radius=5,this.context=a,this.draw=function(){return this.image?void this.context.drawImage(this.image,this.x-128,this.y-128):(this.context.beginPath(),this.context.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),this.context.fillStyle="rgba(0, 255, 255, 1)",this.context.fill(),void this.context.closePath())},this.update=function(){this.x+=this.xVelocity,this.y+=this.yVelocity,this.x>=h?(this.xVelocity=-this.xVelocity,this.x=h):this.x<=0&&(this.xVelocity=-this.xVelocity,this.x=0),this.y>=i?(this.yVelocity=-this.yVelocity,this.y=i):this.y<=0&&(this.yVelocity=-this.yVelocity,this.y=0)},this.setPosition=function(a,b){this.x=a,this.y=b},this.setVelocity=function(a,b){this.xVelocity=a,this.yVelocity=b},this.setImage=function(a){this.image=a}}function b(a,b){return Math.random()*(b-a)+a}function c(){var c=document.getElementById("myCanvas");if(c.getContext){k=c.getContext("2d");for(var g=0;e>g;++g){var j=new a(k);j.setPosition(b(0,h),b(0,i)),j.setVelocity(b(-f,f),b(-f,f)),d.push(j)}}}var d=[],e=40,f=2,g=33,h=$(window).width(),i=$(window).height(),j=new Image;j.onload=function(){d.forEach(function(a){a.setImage(j)})},j.src="../images/Smoke10.794166cc.png";var k;window.draw=function(){k.fillStyle="rgba(0, 0, 0, 0.5)",k.fillRect(0,0,i,h),d.forEach(function(a){a.draw()})},window.update=function(){d.forEach(function(a){a.update()})},c(),k&&(window.drawInterval=setInterval(function(){window.update(),window.draw()},1e3/g))}$(document).ready(function(){d();var a=$("<canvas/>",{id:"myCanvas",height:$(window).height(),width:$(window).width()});$("#smoke-wrapper").prepend(a),f()})}}}),angular.module("clientApp").run(["$templateCache",function(a){a.put("views/entry.html",'<div class="entry-title"> <div class="star-date"> {{vm.data.date | date:\'MMM d, y\'}} </div> <div class="title-text" ng-if="!vm.isEditMode"> {{vm.data.title}} </div> <div class="" ng-if="vm.isEditMode"> <label for="title-text">Title: </label> <input type="text" if="title-text" class="title-text-input" ng-model="vm.tempData.title"> </div> </div> <div class="separator reading-separator"></div> <div class="reading-body"> <div ng-if="!vm.isEditMode"> <div ta-bind ng-model="vm.data.message"></div> </div> <div ng-if="vm.isEditMode" text-angular ng-model="vm.tempData.message"></div> </div> <div class="reading-actions"> <div class="separator entry"></div> <div class="new-entry edit" ng-click="vm.toggleEditMode(\'edit\')" ng-cloak ng-if="!vm.isEditMode"> <i class="fa fa-pencil"></i> Edit </div> <div class="new-entry edit" ng-click="vm.toggleEditMode(\'back\')" ng-cloak ng-if="vm.isEditMode"> <i class="fa fa-arrow-left"></i> Back </div> <div class="new-entry edit save" ng-click="vm.saveProgress()" ng-cloak ng-if="vm.isEditMode"> <i class="fa fa-floppy-o"></i> Save </div> <div class="new-entry delete" ng-click="vm.deleteEntry(vm.data.key)"> <i class="fa fa-trash-o"></i> Delete </div> </div>'),a.put("views/login.html",'<div class="container"> <p>This is the login view.</p> <div class="" ng-click="vm.checkIfLoggedIn()"> Click to check if logged in. </div> <div class="" ng-click="vm.signOutUser()"> Click to sign out user. </div> <div class="well"> Click to try log in. <div class="form"> <div class="form-group"> <label for="userEmail">User Email</label> <input class="form-control" id="userEmail" type="text" name="" value="" ng-model="vm.userEmail"> </div> <div class="form-group"> <label for="password">Password</label> <input class="form-control" type="text" id="password" name="" value="" ng-model="vm.password"> </div> </div> <div class="btn btn-primary" ng-click="vm.login()"> LOGIN </div> </div> <div class="well"> Click to try creating a user. <div class="form"> <div class="form-group"> <label for="newUserEmail">New User\'s email</label> <input class="form-control" id="newUserEmail" type="text" name="" value="" ng-model="vm.newUserEmail"> </div> <div class="form-group"> <label for="newPassword">Password</label> <input class="form-control" type="text" id="newPassword" name="" value="" ng-model="vm.newPassword"> </div> <div class="form-group"> <label for="cmdrName">Commander Name</label> <input class="form-control" id="cmdrName" type="text" name="" value="" ng-model="vm.cmdrName"> </div> </div> <div class="btn btn-danger" ng-click="vm.createUser()"> LOGIN </div> </div> <div class="well"> Update your profile <div class="form"> <div class="form-group"> <label for="newCmdrName">New Commander Name</label> <input class="form-control" id="newCmdrName" type="text" name="" value="" ng-model="vm.newCmdrName"> </div> </div> <div class="btn btn-danger" ng-click="vm.updateUser()"> SAVE </div> </div> </div>'),a.put("views/main.html",'<div class="main-wrapper"> <div class="sidebar"> <div class="sidebar-title"> Journal Entries </div> <div class="separator"></div> <ul class="journal-list"> <li ng-repeat="entry in vm.entries" ui-sref="root.entry({entryId: entry.$key, isNew: false})"> <div class="entry-text"> {{entry.title}} </div> <div class="entry-date"> {{entry.created_at | date:\'MMM d, y\'}} </div> </li> </ul> <div class="new-entry" ng-click="vm.goToNewEntry()"> <i class="fa fa-plus"></i> New Entry </div> </div> <div class="vertical-separator"></div> <div class="reading-pane"> <div id="entry-wrapper" ui-view="entry"></div> </div> </div>'),a.put("views/titlebar.html",'<!-- Add your site or application content here --> <div class="titlebar-wrapper"> <div class="nav-top"></div> <div class="navbar navbar-default" role="navigation"> <div class=""> <div class="navbar-header"> </div> <div class="" id=""> <ul class="nav navbar-nav"> <li ng-class="{active: vm.isEntry()}"> <a ui-sref="root.dashboard">CMDR Logs</a> </li> <!-- <li ui-sref-active="active"><a ui-sref="root.about">About</a></li> --> <li ng-if="!vm.user.data" ui-sref-active="active"> <a ui-sref="root.login">Login</a> </li> <li ng-if="vm.user.data" ui-sref-active="active"> <a ui-sref="root.login">{{vm.user.data.displayName || \'Commander\'}}</a> </li> </ul> </div> </div> </div> <div class="nav-bottom"></div> </div>')}]);