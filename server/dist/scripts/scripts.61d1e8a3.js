"use strict";angular.module("clientApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngTouch","ui.router","textAngular","toastr","ngAudio","firebase"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("root",{url:"","abstract":!0,resolve:{currentUser:["auth",function(a){return a.$waitForSignIn()}]},views:{"titlebar@":{templateUrl:"views/titlebar.html",controller:"TitlebarCtrl",controllerAs:"vm"}}}),a.state("root.dashboard",{url:"/",resolve:{dashboard:["auth",function(a){return a.$requireSignIn()}]},data:{pageName:"MainCtrl",browserTitle:"Main"},views:{"container@":{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"vm"},"entry@root.dashboard":{templateUrl:"views/entry.html",controller:"EntryCtrl",controllerAs:"vm"}}}),a.state("root.entry",{url:"/entries/:entryId",parent:"root",resolve:{entry:["auth",function(a){return a.$requireSignIn()}]},params:{isNew:null},data:{pageName:"EntryCtrl",browserTitle:"Entry"},views:{"container@":{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"vm"},"entry@root.entry":{templateUrl:"views/entry.html",controller:"EntryCtrl",controllerAs:"vm"}}}),a.state("root.login",{url:"/login",parent:"root",params:{isNew:null},data:{pageName:"LoginCtrl",browserTitle:"Login"},views:{"container@":{templateUrl:"views/login.html",controller:"LoginCtrl",controllerAs:"vm"}}})}]).config(["$provide","toastrConfig",function(a,b){a.decorator("taOptions",["taRegisterTool","$delegate",function(a,b){return b.toolbar=[["bold","italics","underline","justifyLeft","justifyCenter","justifyRight","h1","h2","h3","p","pre","html","insertImage","insertLink","insertVideo"]],b}]),angular.extend(b,{templates:{toast:"views/toast.html"}})}]).run(["firebaseSvc","$rootScope","$state","$location","googleAnalytics",function(a,b,c,d,e){a.initialize(),e.init(),b.$on("$stateChangeSuccess",function(a){e.trackPage(d.path())}),b.$on("$stateChangeError",function(a,b,d,e,f,g){("NO USER"===g||"AUTH_REQUIRED"===g)&&(a.preventDefault(),c.go("root.login",{}))})}]),angular.module("clientApp").controller("MainCtrl",["ngAudio","$firebaseArray","$location","$state","entries","toastr","$timeout",function(a,b,c,d,e,f,g){function h(){j()}function i(){k("click"),d.go("root.entry",{isNew:!0}),g(function(){c.path("/entries/new").replace().notify(!1)},100)}function j(){l.entries=b(e.getUserEntries())}function k(a){"click"===a?l.clickBtnSound.play():"hover"===a&&l.clickBtnHover.play()}var l=this;l.entries=[],l.goToNewEntry=i,l.clickBtnSound=a.load("../sounds/buttonClick.mp3"),l.clickBtnHover=a.load("../sounds/buttonHover.mp3"),l.playSound=k,h()}]),angular.module("clientApp").factory("firebaseSvc",["$window",function(a){var b,c,d,e=null;return{initialize:function(){var f={apiKey:"AIzaSyC4shLU7c2ldYdctyitLe4qmPv09H3pXk8",authDomain:"cmdr-logs.firebaseapp.com",databaseURL:"https://cmdr-logs.firebaseio.com",storageBucket:"cmdr-logs.appspot.com",messagingSenderId:"375363069051"};b=a.firebase.initializeApp(f),c=a.firebase.storage(),d=a.firebase.auth().onAuthStateChanged(function(a){e=a})}}}]),angular.module("clientApp").controller("LoginCtrl",["loaderSvc","ngAudio","$state","auth","toastr","$window",function(a,b,c,d,e,f){function g(){i()}function h(a){"Windows"===a?f.location.href="https://github.com/bpkennedy/cmdr-logs/raw/master/desktopApps/commanderLogWindows.7z":"Mac"===a&&(f.location.href="https://github.com/bpkennedy/cmdr-logs/raw/master/desktopApps/CommanderLog.dmg")}function i(){"undefined"!=typeof process&&process.versions&&void 0!==process.versions.electron?t.detect.isElectron=!0:j()}function j(){var a=f.platform;a.os.family.indexOf("Windows")>-1||a.description.indexOf("Windows")>-1?t.detect.osType="Windows":a.os.family.indexOf("Mac")>-1||a.description.indexOf("Mac")>-1||a.os.family.indexOf("OS X")>-1?t.detect.osType="Mac":t.detecet.isElectron=!1}function k(a){a&&(s("click"),t.createMode?p():o())}function l(){t.createMode=!1,t.resetPasswordMode=!0}function m(){t.createMode=!1,t.resetPasswordMode=!1}function n(){t.auth.$sendPasswordResetEmail(t.resetEmail).then(function(){t.resetPasswordMode=!1,e.success("Password reset email sent to "+t.resetEmail,"Success!")})["catch"](function(a){e.error(a.message,a.code)})}function o(){a.toggleOnText("Retrieving data.."),t.auth.$signInWithEmailAndPassword(t.userEmail,t.password).then(function(b){t.user=d.$getAuth();var f=t.user.displayName||t.user.email;c.go("root.dashboard",{isNew:!1}),e.success("Welcome back "+f,"Yo!"),a.toggleOff()})["catch"](function(a){e.error(a.message,a.code)})}function p(){t.auth.$createUserWithEmailAndPassword(t.newUserEmail,t.newPassword).then(function(){q(t.cmdrName,"new")})["catch"](function(a){e.error(a.message,a.code)})}function q(a,b){s("click");var d=f.firebase.auth().currentUser;d.updateProfile({displayName:a}).then(function(){t.newCmdrName="",e.success("Updated profile.","Success!"),b&&c.go("root.dashboard")},function(a){e.error(a.message,a.code)})}function r(){s("click"),t.auth.$signOut().then(function(a){t.user=a,e.success("You signed out.","Success!")})["catch"](function(a){e.error(a.message,a.code)})}function s(a){"click"===a?t.clickBtnSound.play():"hover"===a&&t.clickBtnHover.play()}var t=this;t.auth=d,t.user=d.$getAuth(),t.clickBtnSound=b.load("../sounds/buttonClick.mp3"),t.clickBtnHover=b.load("../sounds/buttonHover.mp3"),t.playSound=s,t.submitForm=k,t.createUser=p,t.updateProfile=q,t.resetPassword=l,t.cancelAction=m,t.login=o,t.signOutUser=r,t.forgotPassword=n,t.password="",t.userEmail="",t.newUserEmail="",t.resetEmail="",t.newPassword="",t.confirmPassword="",t.cmdrName="",t.newCmdrName="",t.createMode=!1,t.resetPasswordMode=!1,t.detect={isElectron:!1,osType:""},t.download=h,g()}]),angular.module("clientApp").factory("auth",["$firebaseAuth",function(a){return a()}]),angular.module("clientApp").controller("TitlebarCtrl",["auth","$state","currentUser","$timeout",function(a,b,c,d){function e(){var a=b.current.name;return"root.entry"===a||"root.dashboard"===a?!0:!1}var f=this;f.auth=a,f.user=a.$getAuth(),f.isEntry=e,f.auth.$onAuthStateChanged(function(a){a?f.user=a:f.user=null})}]),angular.module("clientApp").factory("entries",["auth","$firebaseObject","$window","toastr",function(a,b,c,d){function e(){return c.firebase.database().ref("users/"+m.user.uid).child("entries")}function f(a){return c.firebase.database().ref("entries").child(a)}function g(a){return a.$remove().then(function(d){var e=c.firebase.database().ref("/users/"+m.user.uid+"/entries/"+a.$id),f=b(e);return f.$remove()})}function h(a){var b=k();return a.modified_at=b,a.$save().then(function(d){var e=c.firebase.database().ref("/users/"+m.user.uid+"/entries/"+a.$id);return e.update({title:a.title,message:a.message,modified_at:b})})["catch"](function(a){d.error(a.message,a.code)})}function i(a){var b=c.firebase.database().ref("/entries/");return b.push({title:a.title,message:a.message,modified_at:k(),created_at:k(),created_by:m.user.uid}).then(function(b){var c=b.key;return m.lastCreatedUid.key=c,j(a,c)})["catch"](function(a){d.error(a.message,a.code)})}function j(a,b){var d=c.firebase.database().ref("/users/"+m.user.uid+"/entries/");return d.child(b).set({title:a.title,message:a.message,modified_at:k(),created_at:k(),created_by:m.user.uid})}function k(){var a=new Date,b=a.getFullYear(),c=a.getMonth(),d=a.getDate(),e=new Date(b+1286,c,d);return e.getTime()}function l(){return m.lastCreatedUid.key}var m=this;return m.user=a.$getAuth(),m.lastCreatedUid={key:""},{getUserEntries:e,getSingleEntry:f,createEntry:i,deleteEntry:g,updateEntry:h,getRecentNewEntry:l}}]),angular.module("clientApp").controller("EntryCtrl",["ngAudio","$firebaseObject","$sce","$state","auth","$stateParams","entries","toastr","googleAnalytics",function(a,b,c,d,e,f,g,h,i){function j(){"root.entry"===x.stateName&&k()}function k(){x.isNew?o("new"):r()}function l(){x.confirm.show=!1,x.confirm.type="",x.confirm.message=""}function m(){w("click"),l(),x.isEditMode=!x.isEditMode,x.tempData.title=null,x.tempData.message=null,x.isNew&&(x.isNew=!1,d.go("root.dashboard",{isNew:!1}))}function n(){"save"===x.confirm.type?(l(),x.saveProgress()):"delete"===x.confirm.type&&(l(),p(),w("click"))}function o(a){"back"===a?x.tempData.title!==x.data.title||x.tempData.message!==x.data.message?(w("click"),x.confirm.show=!0,x.confirm.type="save",x.confirm.message="Save your changes?"):m():"edit"===a?(w("click"),x.isEditMode=!x.isEditMode,x.tempData.title=x.data.title,x.tempData.message=x.data.message):"new"===a?(x.isEditMode=!x.isEditMode,x.data={isNew:!0},x.tempData.title=x.data.title,x.tempData.message=x.data.message):"save"===a?(w("click"),x.isEditMode=!x.isEditMode,x.tempData.title=null,x.tempData.message=null,x.isNew=!1):x.isEditMode=!x.isEditMode}function p(){var a=x.data.$id;g.deleteEntry(x.data).then(function(b){h.success("You deleted entry "+a,"Success!"),i.trackEvent("Entry Page","Deleted entry"),d.go("root.dashboard")})["catch"](function(a){h.error(a.message,a.code)})}function q(){w("click"),x.confirm.show=!0,x.confirm.type="delete",x.confirm.message="Are you sure?"}function r(){x.isEditMode=!1,x.data=b(g.getSingleEntry(x.entryKey))}function s(){x.tempData.title&&""!==x.tempData.title?x.tempData.message&&""!==x.tempData.message?(x.data.title=x.tempData.title,x.data.message=x.tempData.message,x.isNew?t():u()):h.error("No Entry message","Required Fields"):h.error("No Entry title","Required Fields")}function t(){w("click"),g.createEntry(x.data).then(function(a){h.success("You created a new item.","Success!"),i.trackEvent("Entry Page","Created new entry"),o(),d.go("root.dashboard")})["catch"](function(a){h.error(a.message,a.code)})}function u(){w("click"),g.updateEntry(x.data).then(function(a){h.success("You updated entry "+x.data.$id,"Success!"),i.trackEvent("Entry Page","Updated entry"),o()})["catch"](function(a){h.error(a.message,a.code)})}function v(a){var b=c.trustAsHtml(a);return b}function w(a){"click"===a?x.clickBtnSound.play():"hover"===a&&x.clickBtnHover.play()}var x=this;x.entryKey=f.entryId,x.isEditMode=!1,x.isNew=f.isNew||!1,x.stateName=d.current.name,x.toggleEditMode=o,x.deleteEntry=p,x.makeHtmlSafe=v,x.saveProgress=s,x.dismissConfirm=l,x.saveAndReturn=n,x.goBack=m,x.toggleDelete=q,x.clickBtnSound=a.load("../sounds/buttonClick.mp3"),x.clickBtnHover=a.load("../sounds/buttonHover.mp3"),x.playSound=w,x.data=null,x.confirm={show:!1,type:"",message:""},x.tempData={title:null,message:null},j()}]),angular.module("clientApp").directive("smoke",function(){return{template:'<div id="smoke-wrapper"></div>',restrict:"E",link:function(a,b,c){function d(){var a;$(window).on("resize",function(b){clearTimeout(a),a=setTimeout(function(){e();var a=$("<canvas/>",{id:"myCanvas",height:$(window).height(),width:$(window).width()});$("#smoke-wrapper").prepend(a),f()},250)})}function e(){$("canvas").remove(),clearInterval(window.drawInterval)}function f(){function a(a){this.x=0,this.y=0,this.xVelocity=0,this.yVelocity=0,this.radius=5,this.context=a,this.draw=function(){return this.image?void this.context.drawImage(this.image,this.x-128,this.y-128):(this.context.beginPath(),this.context.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),this.context.fillStyle="rgba(0, 255, 255, 1)",this.context.fill(),void this.context.closePath())},this.update=function(){this.x+=this.xVelocity,this.y+=this.yVelocity,this.x>=h?(this.xVelocity=-this.xVelocity,this.x=h):this.x<=0&&(this.xVelocity=-this.xVelocity,this.x=0),this.y>=i?(this.yVelocity=-this.yVelocity,this.y=i):this.y<=0&&(this.yVelocity=-this.yVelocity,this.y=0)},this.setPosition=function(a,b){this.x=a,this.y=b},this.setVelocity=function(a,b){this.xVelocity=a,this.yVelocity=b},this.setImage=function(a){this.image=a}}function b(a,b){return Math.random()*(b-a)+a}function c(){var c=document.getElementById("myCanvas");if(c.getContext){k=c.getContext("2d");for(var g=0;e>g;++g){var j=new a(k);j.setPosition(b(0,h),b(0,i)),j.setVelocity(b(-f,f),b(-f,f)),d.push(j)}}}var d=[],e=40,f=2,g=33,h=$(window).width(),i=$(window).height(),j=new Image;j.onload=function(){d.forEach(function(a){a.setImage(j)})},j.src="../images/Smoke10.794166cc.png";var k;window.draw=function(){k.fillStyle="rgba(0, 0, 0, 0.5)",k.fillRect(0,0,i,h),d.forEach(function(a){a.draw()})},window.update=function(){d.forEach(function(a){a.update()})},c(),k&&(window.drawInterval=setInterval(function(){window.update(),window.draw()},1e3/g))}$(document).ready(function(){d();var a=$("<canvas/>",{id:"myCanvas",height:$(window).height(),width:$(window).width()});$("#smoke-wrapper").prepend(a),f()})}}}),angular.module("clientApp").filter("eliteDate",["$filter",function(a){var b=a("date");return function(a){return b(a,"MMM d, y")}}]),angular.module("clientApp").directive("loader",function(){return{restrict:"EA",scope:{title:"@"},templateUrl:"../../views/loader.html",controller:"LoaderCtrl",controllerAs:"vm",bindToController:!0}}),angular.module("clientApp").controller("LoaderCtrl",["loaderSvc",function(a){var b=this;b.state=a.getState}]),angular.module("clientApp").factory("loaderSvc",function(){function a(){return d}function b(a){"undefined"===a||void 0===a||""===a||null===a?d.text="STAND BY":(d.text=a,d.isShowing=!0)}function c(){d.isShowing=!1}var d={isShowing:!1,text:""};return{getState:a,toggleOnText:b,toggleOff:c}}),angular.module("clientApp").factory("googleAnalytics",["$window",function(a){function b(){!function(a,b,c,d,e,f,g){a.GoogleAnalyticsObject=e,a[e]=a[e]||function(){(a[e].q=a[e].q||[]).push(arguments)},a[e].l=1*new Date,f=b.createElement(c),g=b.getElementsByTagName(c)[0],f.async=1,f.src=d,g.parentNode.insertBefore(f,g)}(window,document,"script","https://www.google-analytics.com/analytics.js","ga"),a.ga("create","UA-90995979-1","auto")}function c(b){a.ga("send","pageview",b)}function d(b,c){a.ga("send","event",{eventCategory:b,eventAction:c})}return{init:b,trackPage:c,trackEvent:d}}]),angular.module("clientApp").run(["$templateCache",function(a){a.put("views/entry.html",'<div class="entry-title"> <div class="star-date"> {{vm.data.created_at | eliteDate }} </div> <div class="title-text" ng-if="!vm.isEditMode"> {{vm.data.title}} </div> <div class="" ng-if="vm.isEditMode"> <label for="title-text">Title: </label> <input type="text" if="title-text" class="title-text-input" ng-model="vm.tempData.title" placeholder="Entry title here..."> </div> </div> <div class="separator reading-separator"></div> <div class="reading-body"> <div ng-if="!vm.isEditMode"> <div ta-bind ng-model="vm.data.message"></div> </div> <div ng-if="vm.isEditMode" text-angular ng-model="vm.tempData.message"></div> </div> <div class="reading-actions"> <div class="separator entry"></div> <div ng-if="vm.data"> <div class="confirm" ng-if="vm.confirm.show"> <div class="message">{{vm.confirm.message}}</div> <div class="yes-confirm new-entry" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.saveAndReturn()">Yes</div> <div class="no-confirm new-entry" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.goBack()" ng-if="vm.confirm.type !== \'delete\'">No</div> <div class="no-confirm new-entry" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.dismissConfirm()">Cancel</div> </div> <div class="new-entry edit" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.toggleEditMode(\'edit\')" ng-cloak ng-if="!vm.isEditMode"> <i class="fa fa-pencil"></i> Edit </div> <div class="new-entry edit" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.toggleEditMode(\'back\')" ng-cloak ng-if="vm.isEditMode"> <i class="fa fa-arrow-left"></i> Back </div> <div class="new-entry edit save" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.saveProgress()" ng-cloak ng-if="vm.isEditMode"> <i class="fa fa-floppy-o"></i> Save </div> <div class="new-entry delete" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.toggleDelete()" ng-if="!vm.data.isNew"> <i class="fa fa-trash-o"></i> Delete </div> </div> </div>'),a.put("views/loader.html",'<div class="loader-wrapper" ng-if="vm.state().isShowing"> <div class="loader-inner-wrap"> <div style="" id="loader"> <svg width="100" height="100" viewbox="0 0 40 40"><path d="m5,8l5,8l5,-8z" class="l1 d1"></path><path d="m5,8l5,-8l5,8z" class="l1 d2"></path><path d="m10,0l5,8l5,-8z" class="l1 d3"></path><path d="m15,8l5,-8l5,8z" class="l1 d4"></path><path d="m20,0l5,8l5,-8z" class="l1 d5"></path><path d="m25,8l5,-8l5,8z" class="l1 d6"></path><path d="m25,8l5,8l5,-8z" class="l1 d7"></path><path d="m30,16l5,-8l5,8z" class="l1 d8"></path><path d="m30,16l5,8l5,-8z" class="l1 d9"></path><path d="m25,24l5,-8l5,8z" class="l1 d10"></path><path d="m25,24l5,8l5,-8z" class="l1 d11"></path><path d="m20,32l5,-8l5,8z" class="l1 d13"></path><path d="m15,24l5,8l5,-8z" class="l1 d14"></path><path d="m10,32l5,-8l5,8z" class="l1 d15"></path><path d="m5,24l5,8l5,-8z" class="l1 d16"></path><path d="m5,24l5,-8l5,8z" class="l1 d17"></path><path d="m0,16l5,8l5,-8z" class="l1 d18"></path><path d="m0,16l5,-8l5,8z" class="l1 d19"></path><path d="m10,16l5,-8l5,8z" class="l2 d0"></path><path d="m15,8l5,8l5,-8z" class="l2 d3"></path><path d="m20,16l5,-8l5,8z" class="l2 d6"></path><path d="m20,16l5,8l5,-8z" class="l2 d9"></path><path d="m15,24l5,-8l5,8z" class="l2 d12"></path><path d="m10,16l5,8l5,-8z" class="l2 d15"></path></svg> </div> <div class="message-holder"> <div class="message"> {{vm.state().text}} </div> </div> </div> </div>'),a.put("views/login.html",'<div class="login-wrapper"> <div class="inner-login-wrapper"> <div class="desktop-apps-wrapper" ng-if="!vm.detect.isElectron"> <div class="cmdr-button download" ng-click="vm.download(\'Windows\')"> <i class="fa fa-download"></i> <span class="button-text">Download for Windows</span> </div> <div class="cmdr-button download" ng-click="vm.download(\'Mac\')"> <i class="fa fa-download"></i> <span class="button-text">Download for Mac</span> </div> </div> <div class="logged-in-info" ng-if="vm.user"> <div class=""> Logged in as {{vm.user.email}} </div> <form class="form" name="updateForm" novalidate> <div class="form-group"> <label for="newCmdrName">Update commander name</label> <input class="" id="newCmdrName" type="text" name="" value="" ng-model="vm.newCmdrName"> </div> <div class="cmdr-button" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.updateProfile(vm.newCmdrName)"> SAVE </div> <div class="cmdr-button delete" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.signOutUser()"> SIGN OUT </div> </form> </div> <form ng-if="!vm.user" name="loginForm" class="form login-form" ng-submit="vm.submitForm(loginForm.$valid)" novalidate> <div class="form-group" ng-if="!vm.createMode && !vm.resetPasswordMode"> <label for="userEmail">Email Address</label> <input class="" id="userEmail" type="email" name="userEmail" ng-model="vm.userEmail" required> <div ng-messages="loginForm.userEmail.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.userEmail.$touched">Email Address is required.</p> <p class="error-message" class="error-message" ng-message="email" ng-show="loginForm.userEmail.$touched">Must be valid email.</p> </div> </div> <div class="form-group" ng-if="!vm.createMode && !vm.resetPasswordMode"> <label for="password">Password</label> <input class="" type="text" name="password" id="password" ng-model="vm.password" required> <div ng-messages="loginForm.password.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.password.$touched">Password is required.</p> </div> </div> <div class="form-group" ng-if="vm.createMode"> <label for="newUserEmail">Email Address</label> <input class="" id="newUserEmail" type="text" name="newUserEmail" ng-model="vm.newUserEmail" required> <div ng-messages="loginForm.newUserEmail.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.newUserEmail.$touched">Email Address is required.</p> <p class="error-message" ng-message="email" ng-show="loginForm.newUserEmail.$touched">Must be valid email.</p> </div> </div> <div class="form-group" ng-if="vm.createMode"> <label for="cmdrName">Commander Name</label> <input class="" id="cmdrName" type="text" name="cmdrName" ng-model="vm.cmdrName" required> <div ng-messages="loginForm.cmdrName.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.cmdrName.$touched">Commander Name is required.</p> </div> </div> <div class="form-group" ng-if="vm.createMode"> <label for="newPassword">Password</label> <input class="" type="text" id="newPassword" name="newPassword" ng-model="vm.newPassword" required> <div ng-messages="loginForm.newPassword.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.newPassword.$touched">Password is required.</p> </div> </div> <div class="form-group" ng-if="vm.createMode"> <label for="confirmPassword">Confirm Password</label> <input class="" type="text" id="confirmPassword" name="confirmPassword" ng-model="vm.confirmPassword" ng-pattern="\\b{{vm.newPassword}}\\b" required> <div ng-messages="loginForm.confirmPassword.$error"> <p class="error-message" ng-message="pattern" ng-show="loginForm.confirmPassword.$touched">Passwords do not match.</p> </div> </div> <div class="form-group" ng-if="vm.resetPasswordMode"> <label for="resetEmail">Email Address</label> <input class="" id="resetEmail" type="email" name="resetEmail" ng-model="vm.resetEmail" required> <div ng-messages="loginForm.resetEmail.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.resetEmail.$touched">Email is required.</p> <p class="error-message" ng-message="email" ng-show="loginForm.resetEmail.$touched">Must be valid email.</p> </div> </div> <button ng-disabled="loginForm.$invalid" ng-mouseover="vm.playSound(\'hover\')" type="submit" class="cmdr-button" ng-if="!vm.createMode && !vm.resetPasswordMode"> LOGIN </button> <button type="submit" class="cmdr-button" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.createMode = !vm.createMode" ng-if="!vm.createMode && !vm.resetPasswordMode"> REGISTER </button> <button ng-disabled="loginForm.$invalid" ng-mouseover="vm.playSound(\'hover\')" class="cmdr-button" ng-if="vm.createMode"> CREATE </button> <button ng-disabled="loginForm.$invalid" class="cmdr-button" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.forgotPassword()" ng-if="vm.resetPasswordMode"> SEND EMAIL </button> <button class="cmdr-button" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.cancelAction()" ng-if="vm.createMode || vm.resetPasswordMode"> CANCEL </button> <div class="forgot-password" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.resetPassword()" ng-if="!vm.resetPasswordMode && !vm.createMode"> Forgot Password? </div> </form> </div> </div>'),a.put("views/main.html",'<div class="main-wrapper"> <div class="sidebar"> <div class="sidebar-title"> Journal Entries </div> <div class="separator"></div> <ul class="journal-list"> <li ng-repeat="entry in vm.entries" ui-sref="root.entry({entryId: entry.$id, isNew: false})"> <div class="entry-text"> {{entry.title}} </div> <div class="entry-date"> {{entry.created_at | date:\'MMM d, y\'}} </div> </li> </ul> <div class="new-entry" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.goToNewEntry()"> <i class="fa fa-plus"></i> New Entry </div> </div> <div class="vertical-separator"></div> <div class="reading-pane"> <div id="entry-wrapper" ui-view="entry"></div> </div> </div>'),a.put("views/titlebar.html",'<!-- Add your site or application content here --> <div class="titlebar-wrapper"> <div class="nav-top"></div> <div class="navbar navbar-default" role="navigation"> <div class=""> <div class="navbar-header"> </div> <div class="" id=""> <ul class="nav navbar-nav"> <li ng-class="{active: vm.isEntry()}"> <a ui-sref="root.dashboard" ng-audio="../sounds/navClick.mp3" volume="1">CMDR Logs</a> </li> <li ng-if="!vm.user" ui-sref-active="active"> <a ui-sref="root.login" ng-audio="../sounds/navClick.mp3" volume="1">Login</a> </li> <li ng-if="vm.user" ui-sref-active="active" ng-audio="../sounds/navClick.mp3" volume="1"> <a ui-sref="root.login">{{vm.user.displayName || \'COMMANDER\'}}</a> </li> </ul> </div> </div> </div> <div class="nav-bottom"></div> </div>'),a.put("views/toast.html",'<div class="{{toastClass}} {{toastType}}" ng-click="tapToast()"> <div ng-switch on="allowHtml"> <!-- <div ng-switch-default ng-if="title" class="{{titleClass}}" aria-label="{{title}}">{{title}}</div> --> <!-- <div ng-switch-default class="{{messageClass}}" aria-label="{{message}}">{{message}}</div> --> <!-- <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div> --> <!-- <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div> --> <div class="custom-container"> <div class="triangle-container"> <div class="arrow top"></div> <div class="arrow middle"></div> <div class="arrow bottom"></div> </div> <div class="cmdr-toast-lead">{{title}}: {{message}}</div> <div class="background-text"> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> </div> </div> </div> <progress-bar ng-if="progressBar"></progress-bar> </div>')}]);