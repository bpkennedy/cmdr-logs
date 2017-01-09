'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function (auth, $window, entries, toastr, $timeout) {
      var vm = this;
      vm.entries = [];
      vm.userUid = null;

      function init() {
          setUserUid();
      }

      function setUserUid() {
          $timeout(function(){
             vm.userUid = auth.getCurrentUser().data.uid;
             getEntries();
         }, 100);
      }

      function getEntries() {
          entries.getUserEntries(vm.userUid).then(function(response) {
              var rawEntries = response.val();
              var arrayEntries = $window._.values(rawEntries) || [];
              $timeout(function() {
                  vm.entries = arrayEntries;
              });
          }).catch(function(error) {
              toastr.error(error.message, error.code);
          });
      }

      init();
  });
