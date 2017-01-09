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
      vm.createUserEntry = createUserEntry;

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

      function createUserEntry() {
          var testData = {
              title: 'Test Title',
              message: 'Test Message',
          };
          entries.createEntry(testData, vm.userUid).then(function(response) {
              toastr.success('Item saved to database.', 'Success!');
          }).catch(function(error) {
              toastr.error(error.message, error.code);
          });
      }

      init();
  });
