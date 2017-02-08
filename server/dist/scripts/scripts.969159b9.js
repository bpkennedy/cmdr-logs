"use strict";angular.module("clientApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngTouch","ui.router","textAngular","toastr","ngAudio","firebase","ui.select"]).config(["$stateProvider","$urlRouterProvider","uiSelectConfig",function(a,b,c){c.dropdownPosition="down",b.otherwise("/"),a.state("root",{url:"","abstract":!0,resolve:{currentUser:["auth",function(a){return a.$waitForSignIn()}]},views:{"titlebar@":{templateUrl:"views/titlebar.html",controller:"TitlebarCtrl",controllerAs:"vm"}}}),a.state("root.dashboard",{url:"/",resolve:{dashboard:["auth",function(a){return a.$requireSignIn()}]},data:{pageName:"MainCtrl",browserTitle:"Main"},views:{"container@":{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"vm"},"entry@root.dashboard":{templateUrl:"views/entry.html",controller:"EntryCtrl",controllerAs:"vm"}}}),a.state("root.entry",{url:"/entries/:entryId",parent:"root",resolve:{entry:["auth",function(a){return a.$requireSignIn()}]},params:{isNew:null},data:{pageName:"EntryCtrl",browserTitle:"Entry"},views:{"container@":{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"vm"},"entry@root.entry":{templateUrl:"views/entry.html",controller:"EntryCtrl",controllerAs:"vm"}}}),a.state("root.login",{url:"/login",parent:"root",params:{isNew:null},data:{pageName:"LoginCtrl",browserTitle:"Login"},views:{"container@":{templateUrl:"views/login.html",controller:"LoginCtrl",controllerAs:"vm"}}}),a.state("root.map",{url:"/map",parent:"root",params:{isNew:null},data:{pageName:"MapCtrl",browserTitle:"Map"},views:{"container@":{templateUrl:"views/map.html",controller:"MapCtrl",controllerAs:"vm"}}})}]).config(["$provide","toastrConfig",function(a,b){a.decorator("taOptions",["taRegisterTool","$delegate",function(a,b){return b.toolbar=[["bold","italics","underline","justifyLeft","justifyCenter","justifyRight","h1","h2","h3","p","pre","html","insertImage","insertLink","insertVideo"]],b}]),angular.extend(b,{templates:{toast:"views/toast.html"}})}]).run(["firebaseSvc","$rootScope","$state","$location","googleAnalytics",function(a,b,c,d,e){a.initialize(),e.init(),b.$on("$stateChangeSuccess",function(a){e.trackPage(d.path())}),b.$on("$stateChangeError",function(a,b,d,e,f,g){("NO USER"===g||"AUTH_REQUIRED"===g)&&(a.preventDefault(),c.go("root.login",{}))})}]),angular.module("clientApp").controller("MainCtrl",["ngAudio","$firebaseArray","$location","$state","entries","toastr","$timeout",function(a,b,c,d,e,f,g){function h(){j()}function i(){k("click"),d.go("root.entry",{isNew:!0}),g(function(){c.path("/entries/new").replace().notify(!1)},100)}function j(){l.entries=b(e.getUserEntries())}function k(a){"click"===a?l.clickBtnSound.play():"hover"===a&&l.clickBtnHover.play()}var l=this;l.entries=[],l.goToNewEntry=i,l.clickBtnSound=a.load("../sounds/buttonClick.mp3"),l.clickBtnHover=a.load("../sounds/buttonHover.mp3"),l.playSound=k,h()}]),angular.module("clientApp").factory("firebaseSvc",["$window",function(a){var b,c,d,e=null;return{initialize:function(){var f={apiKey:"AIzaSyC4shLU7c2ldYdctyitLe4qmPv09H3pXk8",authDomain:"cmdr-logs.firebaseapp.com",databaseURL:"https://cmdr-logs.firebaseio.com",storageBucket:"cmdr-logs.appspot.com",messagingSenderId:"375363069051"};b=a.firebase.initializeApp(f),c=a.firebase.storage(),d=a.firebase.auth().onAuthStateChanged(function(a){e=a})}}}]),angular.module("clientApp").controller("LoginCtrl",["loaderSvc","ngAudio","$state","auth","toastr","$window",function(a,b,c,d,e,f){function g(){i()}function h(a){"Windows"===a?f.location.href="https://github.com/bpkennedy/cmdr-logs/releases/1.0.1/CommanderLog.dmg":"Mac"===a&&(f.location.href="https://github.com/bpkennedy/cmdr-logs/releases/1.0.1/commanderLogWin.7z")}function i(){"undefined"!=typeof process&&process.versions&&void 0!==process.versions.electron?t.detect.isElectron=!0:j()}function j(){var a=f.platform;a.os.family.indexOf("Windows")>-1||a.description.indexOf("Windows")>-1?t.detect.osType="Windows":a.os.family.indexOf("Mac")>-1||a.description.indexOf("Mac")>-1||a.os.family.indexOf("OS X")>-1?t.detect.osType="Mac":t.detecet.isElectron=!1}function k(a){a&&(s("click"),t.createMode?p():o())}function l(){t.createMode=!1,t.resetPasswordMode=!0}function m(){t.createMode=!1,t.resetPasswordMode=!1}function n(){t.auth.$sendPasswordResetEmail(t.resetEmail).then(function(){t.resetPasswordMode=!1,e.success("Password reset email sent to "+t.resetEmail,"Success!")})["catch"](function(a){e.error(a.message,a.code)})}function o(){a.toggleOnText("Retrieving data.."),t.auth.$signInWithEmailAndPassword(t.userEmail,t.password).then(function(b){t.user=d.$getAuth();var f=t.user.displayName||t.user.email;c.go("root.dashboard",{isNew:!1}),e.success("Welcome back "+f,"Yo!"),a.toggleOff()})["catch"](function(a){e.error(a.message,a.code)})}function p(){t.auth.$createUserWithEmailAndPassword(t.newUserEmail,t.newPassword).then(function(){q(t.cmdrName,"new")})["catch"](function(a){e.error(a.message,a.code)})}function q(a,b){s("click");var d=f.firebase.auth().currentUser;d.updateProfile({displayName:a}).then(function(){t.newCmdrName="",e.success("Updated profile.","Success!"),b&&c.go("root.dashboard")},function(a){e.error(a.message,a.code)})}function r(){s("click"),t.auth.$signOut().then(function(a){t.user=a,e.success("You signed out.","Success!")})["catch"](function(a){e.error(a.message,a.code)})}function s(a){"click"===a?t.clickBtnSound.play():"hover"===a&&t.clickBtnHover.play()}var t=this;t.auth=d,t.user=d.$getAuth(),t.clickBtnSound=b.load("../sounds/buttonClick.mp3"),t.clickBtnHover=b.load("../sounds/buttonHover.mp3"),t.playSound=s,t.submitForm=k,t.createUser=p,t.updateProfile=q,t.resetPassword=l,t.cancelAction=m,t.login=o,t.signOutUser=r,t.forgotPassword=n,t.password="",t.userEmail="",t.newUserEmail="",t.resetEmail="",t.newPassword="",t.confirmPassword="",t.cmdrName="",t.newCmdrName="",t.createMode=!1,t.resetPasswordMode=!1,t.detect={isElectron:!1,osType:""},t.download=h,g()}]),angular.module("clientApp").factory("auth",["$firebaseAuth",function(a){return a()}]),angular.module("clientApp").controller("TitlebarCtrl",["auth","$state","currentUser","$timeout",function(a,b,c,d){function e(){h.loadMap&&b.go("root.map",{isNew:!1})}function f(){var a=b.current.name;return"root"===a||"root.entry"===a||"root.dashboard"===a?!0:!1}function g(){var a=b.current.name;return"root.map"===a?!0:!1}var h=this;h.auth=a,h.user=a.$getAuth(),h.loadMap=!1,h.isEntry=f,h.isMap=g,h.ifMapLoaded=e,h.auth.$onAuthStateChanged(function(a){a?(h.user=a,h.loadMap=!0):h.user=null})}]),angular.module("clientApp").factory("entries",["auth","$firebaseObject","$window","toastr","$http",function(a,b,c,d,e){function f(){return c.firebase.database().ref("users/"+p.user.uid).child("entries")}function g(a){return c.firebase.database().ref("entries").child(a)}function h(a){return a.$remove().then(function(d){var e=c.firebase.database().ref("/users/"+p.user.uid+"/entries/"+a.$id),f=b(e);return f.$remove()})}function i(a){var b=l();return a.modified_at=b,a.$save().then(function(d){var e=c.firebase.database().ref("/users/"+p.user.uid+"/entries/"+a.$id);return e.update({title:a.title,message:a.message,modified_at:b,system:a.system||"",faction:a.faction||""})})["catch"](function(a){d.error(a.message,a.code)})}function j(a){var b=c.firebase.database().ref("/entries/");return b.push({title:a.title,message:a.message,modified_at:l(),created_at:l(),created_by:p.user.uid,system:a.system||"",faction:a.faction||""}).then(function(b){var c=b.key;return p.lastCreatedUid.key=c,k(a,c)})["catch"](function(a){d.error(a.message,a.code)})}function k(a,b){var d=c.firebase.database().ref("/users/"+p.user.uid+"/entries/");return d.child(b).set({title:a.title,message:a.message,modified_at:l(),created_at:l(),created_by:p.user.uid,system:a.system||"",faction:a.faction||""})}function l(){var a=new Date,b=a.getFullYear(),c=a.getMonth(),d=a.getDate(),e=new Date(b+1286,c,d);return e.getTime()}function m(){return p.lastCreatedUid.key}function n(a){return e({method:"GET",url:"https://www.edsm.net/typeahead/systems/query/"+a})}function o(a){return e({method:"GET",url:"https://www.edsm.net/api-v1/system?systemName="+a+"&showCoordinates=1&showInformation=1"})}var p=this;return p.user=a.$getAuth(),p.lastCreatedUid={key:""},{getUserEntries:f,getSingleEntry:g,createEntry:j,deleteEntry:h,updateEntry:i,getRecentNewEntry:m,querySystem:n,getSystem:o}}]),angular.module("clientApp").controller("EntryCtrl",["$rootScope","ngAudio","$firebaseObject","$sce","$state","auth","$stateParams","entries","toastr","googleAnalytics","$window",function(a,b,c,d,e,f,g,h,i,j,k){function l(){"root.entry"===C.stateName&&o()}function m(){C.data.system&&C.info.previousSystem===C.data.system.name.value||h.getSystem(C.tempData.system.name.value).then(function(a){C.data.system=a.data,C.info.previousSystem=C.data.system.name.value})["catch"](function(a){i.error(a.message,a.code)})}function n(a){a.length>2?h.querySystem(a).then(function(a){C.info.data.systems=a.data})["catch"](function(a){i.error(a.message,a.code)}):C.info.data.systems=[]}function o(){C.isNew?s("new"):v()}function p(){C.confirm.show=!1,C.confirm.type="",C.confirm.message=""}function q(){A("click"),p(),C.isEditMode=!C.isEditMode,C.tempData.title=null,C.tempData.message=null,C.isNew&&(C.isNew=!1,e.go("root.dashboard",{isNew:!1}))}function r(){"save"===C.confirm.type?(p(),C.saveProgress()):"delete"===C.confirm.type&&(p(),t(),A("click"))}function s(a){"back"===a?C.tempData.title!==C.data.title||C.tempData.message!==C.data.message?(A("click"),C.confirm.show=!0,C.confirm.type="save",C.confirm.message="Save your changes?"):q():"edit"===a?(A("click"),C.isEditMode=!C.isEditMode,C.tempData.title=C.data.title,C.tempData.message=C.data.message):"new"===a?(C.isEditMode=!C.isEditMode,C.data={isNew:!0},C.tempData.title=C.data.title,C.tempData.message=C.data.message):"save"===a?(A("click"),C.isEditMode=!C.isEditMode,C.tempData.title=null,C.tempData.message=null,C.isNew=!1):C.isEditMode=!C.isEditMode}function t(){var a=C.data.$id;h.deleteEntry(C.data).then(function(b){i.success("You deleted entry "+a,"Success!"),j.trackEvent("Entry Page","Deleted entry"),B(),e.go("root.dashboard")})["catch"](function(a){i.error(a.message,a.code)})}function u(){A("click"),C.confirm.show=!0,C.confirm.type="delete",C.confirm.message="Are you sure?"}function v(){C.isEditMode=!1,C.data=c(h.getSingleEntry(C.entryKey))}function w(){C.tempData.title&&""!==C.tempData.title?C.tempData.message&&""!==C.tempData.message?(C.data.title=C.tempData.title,C.data.message=C.tempData.message,C.data.faction={name:C.tempData.faction.name||"",color:C.tempData.faction.color||""},C.isNew?x():y()):i.error("No Entry message","Required Fields"):i.error("No Entry title","Required Fields")}function x(){A("click"),h.createEntry(C.data).then(function(a){i.success("You created a new item.","Success!"),j.trackEvent("Entry Page","Created new entry"),B(),s(),e.go("root.dashboard")})["catch"](function(a){i.error(a.message,a.code)})}function y(){A("click"),h.updateEntry(C.data).then(function(a){i.success("You updated entry "+C.data.$id,"Success!"),j.trackEvent("Entry Page","Updated entry"),B(),s()})["catch"](function(a){i.error(a.message,a.code)})}function z(a){var b=d.trustAsHtml(a);return b}function A(a){"click"===a?C.clickBtnSound.play():"hover"===a&&C.clickBtnHover.play()}function B(){a.$broadcast("refresh-map")}var C=this;C.entryKey=g.entryId,C.isEditMode=!1,C.isNew=g.isNew||!1,C.stateName=e.current.name,C.toggleEditMode=s,C.deleteEntry=t,C.makeHtmlSafe=z,C.saveProgress=w,C.dismissConfirm=p,C.saveAndReturn=r,C.goBack=q,C.toggleDelete=u,C.clickBtnSound=b.load("../sounds/buttonClick.mp3"),C.clickBtnHover=b.load("../sounds/buttonHover.mp3"),C.playSound=A,C.query=n,C.getSystem=m,C.isSystemInfo=!0,C.data=null,C.confirm={show:!1,type:"",message:""},C.info={previousSystem:{value:""},selectedSystemData:{name:"",information:{}},isShowing:!0,data:{systems:[],factions:[{color:"EF0604",name:"Federation"},{color:"08A5F2",name:"Empire"},{color:"07F41C",name:"Alliance"},{color:"646766",name:"None"}]}},C.tempData={title:null,message:null,system:{},faction:{}},l()}]),angular.module("clientApp").directive("smoke",function(){return{template:'<div id="smoke-wrapper"></div>',restrict:"E",link:function(a,b,c){function d(){var a;$(window).on("resize",function(b){clearTimeout(a),a=setTimeout(function(){e();var a=$("<canvas/>",{id:"smokeCanvas",height:$(window).height(),width:$(window).width()});$("#smoke-wrapper").prepend(a),f()},250)})}function e(){$("#smokeCanvas").remove(),clearInterval(window.drawInterval)}function f(){function a(a){this.x=0,this.y=0,this.xVelocity=0,this.yVelocity=0,this.radius=5,this.context=a,this.draw=function(){return this.image?void this.context.drawImage(this.image,this.x-128,this.y-128):(this.context.beginPath(),this.context.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),this.context.fillStyle="rgba(0, 255, 255, 1)",this.context.fill(),void this.context.closePath())},this.update=function(){this.x+=this.xVelocity,this.y+=this.yVelocity,this.x>=h?(this.xVelocity=-this.xVelocity,this.x=h):this.x<=0&&(this.xVelocity=-this.xVelocity,this.x=0),this.y>=i?(this.yVelocity=-this.yVelocity,this.y=i):this.y<=0&&(this.yVelocity=-this.yVelocity,this.y=0)},this.setPosition=function(a,b){this.x=a,this.y=b},this.setVelocity=function(a,b){this.xVelocity=a,this.yVelocity=b},this.setImage=function(a){this.image=a}}function b(a,b){return Math.random()*(b-a)+a}function c(){var c=document.getElementById("smokeCanvas");if(c.getContext){k=c.getContext("2d");for(var g=0;e>g;++g){var j=new a(k);j.setPosition(b(0,h),b(0,i)),j.setVelocity(b(-f,f),b(-f,f)),d.push(j)}}}var d=[],e=40,f=2,g=33,h=$(window).width(),i=$(window).height(),j=new Image;j.onload=function(){d.forEach(function(a){a.setImage(j)})},j.src="../images/Smoke10.794166cc.png";var k;window.draw=function(){k.fillStyle="rgba(0, 0, 0, 0.5)",k.fillRect(0,0,i,h),d.forEach(function(a){a.draw()})},window.update=function(){d.forEach(function(a){a.update()})},c(),k&&(window.drawInterval=setInterval(function(){window.update(),window.draw()},1e3/g))}$(document).ready(function(){d();var a=$("<canvas/>",{id:"smokeCanvas",height:$(window).height(),width:$(window).width()});$("#smoke-wrapper").prepend(a),f()})}}}),angular.module("clientApp").filter("eliteDate",["$filter",function(a){var b=a("date");return function(a){return b(a,"MMM d, y")}}]),angular.module("clientApp").directive("loader",function(){return{restrict:"EA",scope:{title:"@"},template:'<div class="loader-wrapper" ng-if="vm.state().isShowing"><div class="loader-inner-wrap"><div style="" id="loader"><svg width="100" height="100" viewBox="0 0 40 40"><path d="m5,8l5,8l5,-8z" class="l1 d1"></path><path d="m5,8l5,-8l5,8z" class="l1 d2"></path><path d="m10,0l5,8l5,-8z" class="l1 d3"></path><path d="m15,8l5,-8l5,8z" class="l1 d4"></path><path d="m20,0l5,8l5,-8z" class="l1 d5"></path><path d="m25,8l5,-8l5,8z" class="l1 d6"></path><path d="m25,8l5,8l5,-8z" class="l1 d7"></path><path d="m30,16l5,-8l5,8z" class="l1 d8"></path><path d="m30,16l5,8l5,-8z" class="l1 d9"></path><path d="m25,24l5,-8l5,8z" class="l1 d10"></path><path d="m25,24l5,8l5,-8z" class="l1 d11"></path><path d="m20,32l5,-8l5,8z" class="l1 d13"></path><path d="m15,24l5,8l5,-8z" class="l1 d14"></path><path d="m10,32l5,-8l5,8z" class="l1 d15"></path><path d="m5,24l5,8l5,-8z" class="l1 d16"></path><path d="m5,24l5,-8l5,8z" class="l1 d17"></path><path d="m0,16l5,8l5,-8z" class="l1 d18"></path><path d="m0,16l5,-8l5,8z" class="l1 d19"></path><path d="m10,16l5,-8l5,8z" class="l2 d0"></path><path d="m15,8l5,8l5,-8z" class="l2 d3"></path><path d="m20,16l5,-8l5,8z" class="l2 d6"></path><path d="m20,16l5,8l5,-8z" class="l2 d9"></path><path d="m15,24l5,-8l5,8z" class="l2 d12"></path><path d="m10,16l5,8l5,-8z" class="l2 d15"></path></svg></div><div class="message-holder"><div class="message"> {{vm.state().text}} </div></div></div></div>',controller:"LoaderCtrl",controllerAs:"vm",bindToController:!0}}),angular.module("clientApp").controller("LoaderCtrl",["loaderSvc",function(a){var b=this;b.state=a.getState}]),angular.module("clientApp").factory("loaderSvc",function(){function a(){return d}function b(a){"undefined"===a||void 0===a||""===a||null===a?d.text="STAND BY":(d.text=a,d.isShowing=!0)}function c(){d.isShowing=!1}var d={isShowing:!1,text:""};return{getState:a,toggleOnText:b,toggleOff:c}}),angular.module("clientApp").factory("googleAnalytics",["$window",function(a){function b(){!function(a,b,c,d,e,f,g){a.GoogleAnalyticsObject=e,a[e]=a[e]||function(){(a[e].q=a[e].q||[]).push(arguments)},a[e].l=1*new Date,f=b.createElement(c),g=b.getElementsByTagName(c)[0],f.async=1,f.src=d,g.parentNode.insertBefore(f,g)}(window,document,"script","https://www.google-analytics.com/analytics.js","ga"),a.ga("create","UA-90995979-1","auto")}function c(b){a.ga("send","pageview",b)}function d(b,c){a.ga("send","event",{eventCategory:b,eventAction:c})}return{init:b,trackPage:c,trackEvent:d}}]),angular.module("clientApp").directive("mapsize",["$window",function(a){return function(b,c){var d=angular.element(a);b.getWindowDimensions=function(){return{h:d.height(),w:d.width()}},b.$watch(b.getWindowDimensions,function(a,c){b.windowHeight=a.h,b.windowWidth=a.w,b.style=function(){return{height:a.h+"px",width:a.w+"px"}}},!0),d.bind("resize",function(){b.$apply()})}}]),angular.module("clientApp").controller("MapCtrl",["$window",function(a){}]),angular.module("clientApp").directive("galaxyMap",function(){return{scope:{},template:'<div class=""><div id="edmap" class="map-background show-map" ng-style="style()" mapsize></div></div>',controller:"GalaxyMapCtrl",controllerAs:"vm",restrict:"EA",bindToController:!0}}),angular.module("clientApp").controller("GalaxyMapCtrl",["$state","$compile","$scope","$timeout","$window","entries","$firebaseArray","loaderSvc",function(a,b,c,d,e,f,g,h){function i(){j()}function j(a){m.entries=g(f.getUserEntries()),d(function(){k(m.entries,a)},2e3)}function k(a,b){var c=_.filter(a,"system"),d=_.forEach(c,function(a,b){a.system.infos=a.message});if(m.mapData=_.map(d,function(a){var b=a.system;return b.faction=a.faction||"",b}),m.mapSkeleton.systems=m.mapData,m.mapSkeleton.systems=_.map(m.mapSkeleton.systems,function(a){return"Federation"===a.faction.name?(a.cat=[],a.cat.push(0)):"Empire"===a.faction.name?(a.cat=[],a.cat.push(1)):"Alliance"===a.faction.name?(a.cat=[],a.cat.push(2)):(a.cat=[],a.cat.push(3)),a}),m.mapData=m.mapSkeleton,b===!0){var f={json:m.mapData};e.Ed3d.rebuild(f)}else l()}function l(){e.Ed3d.init({container:"edmap",json:m.mapData,withFullscreenToggle:!1,popupDetail:!1,withOptionsPanel:!0,withHudPanel:!0,hudMultipleSelect:!0,effectScaleSystem:[5,3e3],startAnim:!0,showGalaxyInfos:!0,systemColor:"#02E8AA",playerPos:[0,0,0],cameraPos:[-12e3,12e3,-2e4]})}var m=this;m.entries=[],m.mapData=[],m.mapSkeleton={categories:{Factions:{0:{color:"EF0604",name:"Federation"},1:{color:"08A5F2",name:"Empire"},2:{color:"07F41C",name:"Alliance"},3:{color:"646766",name:"none"}}},systems:[]},c.$on("refresh-map",function(a,b){j(!0)}),i()}]),angular.module("clientApp").run(["$templateCache",function(a){a.put("views/entry.html",'<div class="entry-title"> <div class="star-date"> {{vm.data.created_at | eliteDate }} </div> <div class="title-text" ng-if="!vm.isEditMode"> {{vm.data.title}} </div> <div class="" ng-if="vm.isEditMode"> <label for="title-text">Title: </label> <input type="text" if="title-text" class="title-text-input" ng-model="vm.tempData.title" placeholder="Entry title here..."> </div> </div> <div class="separator reading-separator"></div> <div class="reading-body" ng-class="{\'info-panel-show\': vm.info.isShowing}"> <div ng-if="!vm.isEditMode"> <div ta-bind ng-model="vm.data.message"></div> </div> <div ng-if="vm.isEditMode" text-angular ng-model="vm.tempData.message"></div> </div> <div class="entry-info" ng-class="{\'info-panel-show\': vm.info.isShowing}"> <div class="info-header"> <div class="sub-header" ng-class="{\'sub-active\': vm.isSystemInfo}" ng-click="vm.isSystemInfo = true;"> SYSTEM DATA </div> <div class="sub-header" ng-class="{\'sub-active\': !vm.isSystemInfo}" ng-click="vm.isSystemInfo = false;"> MISSION DATA </div> </div> <div class="separator"></div> <div class="info-panel" ng-if="vm.isSystemInfo"> <ui-select ng-model="vm.tempData.system.name" ng-change="vm.getSystem()" ng-if="vm.isEditMode"> <ui-select-match placeholder="Search for Systems">{{$select.selected.value}}</ui-select-match> <ui-select-choices repeat="system in (vm.info.data.systems | filter: $select.search) track by system.id" refresh="vm.query($select.search)" refresh-delay="300"> <span ng-bind-html="system.value"></span> </ui-select-choices> </ui-select> <div class="system-name">{{vm.data.system.name}}</div> <div class="info-inner-wrap" ng-if="!vm.data.system.name && !vm.isEditMode"> <div class="new-info-prompt"> In Edit Mode, indicate the system for this entry. </div> </div> <div class="info-inner-wrap" ng-if="vm.data.system.name"> <ul class="info-wrapper"> <li class="info-item"> <div class="">Allegiance:</div> <div class="">{{vm.data.system.information.allegiance}}</div> </li> <li class="info-item"> <div class="">Government:</div> <div class="">{{vm.data.system.information.government}}</div> </li> <li class="info-item"> <div class="">Faction:</div> <div class="">{{vm.data.system.information.faction}}</div> </li> <li class="info-item"> <div class="">Population:</div> <div class="">{{vm.data.system.information.population | number : fractionSize}}</div> </li> </ul> </div> </div> <div class="info-panel" ng-if="!vm.isSystemInfo"> <ui-select ng-model="vm.tempData.faction" ng-if="vm.isEditMode"> <ui-select-match placeholder="Select your faction">{{$select.selected.name}}</ui-select-match> <ui-select-choices repeat="faction in vm.info.data.factions | filter: $select.search"> <span ng-bind-html="faction.name"></span> </ui-select-choices> </ui-select> <div class="info-inner-wrap" ng-if="!vm.data.faction.name && !vm.isEditMode"> <div class="new-info-prompt"> In Edit Mode, indicate the faction whose goals you are furthering. </div> </div> <div class="info-inner-wrap" ng-if="vm.data.faction.name"> <ul class="info-wrapper"> <li class="info-item"> <div class="">Agent of:</div> <div class="">{{vm.data.faction.name}}</div> </li> </ul> </div> </div> </div> <div class="reading-actions"> <div class="separator entry"></div> <div ng-if="vm.data"> <div class="confirm" ng-if="vm.confirm.show"> <div class="message">{{vm.confirm.message}}</div> <div class="yes-confirm new-entry" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.saveAndReturn()">Yes</div> <div class="no-confirm new-entry" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.goBack()" ng-if="vm.confirm.type !== \'delete\'">No</div> <div class="no-confirm new-entry" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.dismissConfirm()">Cancel</div> </div> <div class="new-entry edit" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.toggleEditMode(\'edit\')" ng-cloak ng-if="!vm.isEditMode"> <i class="fa fa-pencil"></i> Edit </div> <div class="new-entry edit" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.toggleEditMode(\'back\')" ng-cloak ng-if="vm.isEditMode"> <i class="fa fa-arrow-left"></i> Back </div> <div class="new-entry edit save" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.saveProgress()" ng-cloak ng-if="vm.isEditMode"> <i class="fa fa-floppy-o"></i> Save </div> <div class="new-entry delete" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.toggleDelete()" ng-if="!vm.data.isNew"> <i class="fa fa-trash-o"></i> Delete </div> <div class="new-entry info" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.info.isShowing = !vm.info.isShowing"> <i class="fa fa-info-circle"></i> Info </div> </div> </div>'),a.put("views/login.html",'<div class="login-wrapper"> <div class="inner-login-wrapper"> <div class="desktop-apps-wrapper" ng-if="!vm.detect.isElectron"> <div class="cmdr-button download" ng-click="vm.download(\'Windows\')"> <i class="fa fa-download"></i> <span class="button-text">Download for Windows</span> </div> <div class="cmdr-button download" ng-click="vm.download(\'Mac\')"> <i class="fa fa-download"></i> <span class="button-text">Download for Mac</span> </div> </div> <div class="logged-in-info" ng-if="vm.user"> <div class=""> Logged in as {{vm.user.email}} </div> <form class="form" name="updateForm" novalidate> <div class="form-group"> <label for="newCmdrName">Update commander name</label> <input class="" id="newCmdrName" type="text" name="" value="" ng-model="vm.newCmdrName"> </div> <div class="cmdr-button" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.updateProfile(vm.newCmdrName)"> SAVE </div> <div class="cmdr-button delete" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.signOutUser()"> SIGN OUT </div> </form> </div> <form ng-if="!vm.user" name="loginForm" class="form login-form" ng-submit="vm.submitForm(loginForm.$valid)" novalidate> <div class="form-group" ng-if="!vm.createMode && !vm.resetPasswordMode"> <label for="userEmail">Email Address</label> <input class="" id="userEmail" type="email" name="userEmail" ng-model="vm.userEmail" required> <div ng-messages="loginForm.userEmail.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.userEmail.$touched">Email Address is required.</p> <p class="error-message" class="error-message" ng-message="email" ng-show="loginForm.userEmail.$touched">Must be valid email.</p> </div> </div> <div class="form-group" ng-if="!vm.createMode && !vm.resetPasswordMode"> <label for="password">Password</label> <input class="" type="text" name="password" id="password" ng-model="vm.password" required> <div ng-messages="loginForm.password.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.password.$touched">Password is required.</p> </div> </div> <div class="form-group" ng-if="vm.createMode"> <label for="newUserEmail">Email Address</label> <input class="" id="newUserEmail" type="text" name="newUserEmail" ng-model="vm.newUserEmail" required> <div ng-messages="loginForm.newUserEmail.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.newUserEmail.$touched">Email Address is required.</p> <p class="error-message" ng-message="email" ng-show="loginForm.newUserEmail.$touched">Must be valid email.</p> </div> </div> <div class="form-group" ng-if="vm.createMode"> <label for="cmdrName">Commander Name</label> <input class="" id="cmdrName" type="text" name="cmdrName" ng-model="vm.cmdrName" required> <div ng-messages="loginForm.cmdrName.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.cmdrName.$touched">Commander Name is required.</p> </div> </div> <div class="form-group" ng-if="vm.createMode"> <label for="newPassword">Password</label> <input class="" type="text" id="newPassword" name="newPassword" ng-model="vm.newPassword" required> <div ng-messages="loginForm.newPassword.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.newPassword.$touched">Password is required.</p> </div> </div> <div class="form-group" ng-if="vm.createMode"> <label for="confirmPassword">Confirm Password</label> <input class="" type="text" id="confirmPassword" name="confirmPassword" ng-model="vm.confirmPassword" ng-pattern="\\b{{vm.newPassword}}\\b" required> <div ng-messages="loginForm.confirmPassword.$error"> <p class="error-message" ng-message="pattern" ng-show="loginForm.confirmPassword.$touched">Passwords do not match.</p> </div> </div> <div class="form-group" ng-if="vm.resetPasswordMode"> <label for="resetEmail">Email Address</label> <input class="" id="resetEmail" type="email" name="resetEmail" ng-model="vm.resetEmail" required> <div ng-messages="loginForm.resetEmail.$error"> <p class="error-message" ng-message="required" ng-show="loginForm.resetEmail.$touched">Email is required.</p> <p class="error-message" ng-message="email" ng-show="loginForm.resetEmail.$touched">Must be valid email.</p> </div> </div> <button ng-disabled="loginForm.$invalid" ng-mouseover="vm.playSound(\'hover\')" type="submit" class="cmdr-button" ng-if="!vm.createMode && !vm.resetPasswordMode"> LOGIN </button> <button type="submit" class="cmdr-button" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.createMode = !vm.createMode" ng-if="!vm.createMode && !vm.resetPasswordMode"> REGISTER </button> <button ng-disabled="loginForm.$invalid" ng-mouseover="vm.playSound(\'hover\')" class="cmdr-button" ng-if="vm.createMode"> CREATE </button> <button ng-disabled="loginForm.$invalid" class="cmdr-button" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.forgotPassword()" ng-if="vm.resetPasswordMode"> SEND EMAIL </button> <button class="cmdr-button" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.cancelAction()" ng-if="vm.createMode || vm.resetPasswordMode"> CANCEL </button> <div class="forgot-password" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.resetPassword()" ng-if="!vm.resetPasswordMode && !vm.createMode"> Forgot Password? </div> </form> </div> </div>'),a.put("views/main.html",'<div class="main-wrapper"> <div class="sidebar"> <div class="sidebar-title"> Journal Entries </div> <div class="separator"></div> <ul class="journal-list"> <li ng-repeat="entry in vm.entries" ui-sref="root.entry({entryId: entry.$id, isNew: false})"> <div class="entry-text"> {{entry.title}} </div> <div class="entry-date"> {{entry.created_at | date:\'MMM d, y\'}} </div> </li> </ul> <div class="new-entry" ng-mouseover="vm.playSound(\'hover\')" ng-click="vm.goToNewEntry()"> <i class="fa fa-plus"></i> New Entry </div> </div> <div class="vertical-separator"></div> <div class="reading-pane"> <div id="entry-wrapper" ui-view="entry"></div> </div> </div>'),a.put("views/map.html",""),a.put("views/titlebar.html",'<!-- Add your site or application content here --> <div class="titlebar-wrapper"> <div class="nav-top"></div> <div class="navbar navbar-default" role="navigation"> <div class=""> <div class="navbar-header"> </div> <div class="" id=""> <ul class="nav navbar-nav"> <li ng-class="{\'active\': vm.isEntry()}"> <a ui-sref="root.dashboard" ng-audio="../sounds/navClick.mp3" volume="1">CMDR Logs</a> </li> <li ng-class="{\'active\': vm.isMap()}"> <a ng-click="vm.ifMapLoaded()" ng-audio="../sounds/navClick.mp3" volume="1">Galaxy Map</a> </li> <li ng-if="!vm.user" ui-sref-active="active"> <a ui-sref="root.login" ng-audio="../sounds/navClick.mp3" volume="1">Login</a> </li> <li ng-if="vm.user" ui-sref-active="active" ng-audio="../sounds/navClick.mp3" volume="1"> <a ui-sref="root.login">{{vm.user.displayName || \'COMMANDER\'}}</a> </li> </ul> </div> </div> </div> <div class="nav-bottom"></div> </div> <div class="" ng-if="vm.loadMap"> <galaxy-map class="map-background" ng-class="{\'show-map\': vm.isMap()}"></galaxy-map> </div>'),a.put("views/toast.html",'<div class="{{toastClass}} {{toastType}}" ng-click="tapToast()"> <div ng-switch on="allowHtml"> <!-- <div ng-switch-default ng-if="title" class="{{titleClass}}" aria-label="{{title}}">{{title}}</div> --> <!-- <div ng-switch-default class="{{messageClass}}" aria-label="{{message}}">{{message}}</div> --> <!-- <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div> --> <!-- <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div> --> <div class="custom-container"> <div class="triangle-container"> <div class="arrow top"></div> <div class="arrow middle"></div> <div class="arrow bottom"></div> </div> <div class="cmdr-toast-lead">{{title}}: {{message}}</div> <div class="background-text"> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> <div class="repeating-text">> {{title}}: {{message}}</div> </div> </div> </div> <progress-bar ng-if="progressBar"></progress-bar> </div>');
}]);