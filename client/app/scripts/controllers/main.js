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
      vm.createEntry = createEntry;

      function init() {
          setUserUid();
      }

      function setUserUid() {
          $timeout(function(){
             vm.userUid = auth.getCurrentUser().data.uid;
             getEntries();
         }, 100);
      }

      function createEntry() {
          var testData = {
              title: 'This is an Orange Test',
              message: 'An awesome example of it working, doge.'
          };
          entries.createEntry(testData, vm.userUid).then(function() {
              toastr.success('You created a new item.', 'Success!');
              getEntries();
          }).catch(function(error) {
              toastr.error(error.message, error.code);
          });
      }

      function getEntries() {
          entries.getUserEntries(vm.userUid).then(function(response) {
              var rawEntries = response.val();
              $window._.map(rawEntries, function(val, key) {
                  val.$key = key;
              });
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
