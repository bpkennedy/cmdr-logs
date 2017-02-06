'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:galaxyMap
 * @description
 * # galaxyMap
 */
angular.module('clientApp')
  .directive('galaxyMap', function () {
    return {
      template: '<div class="">' +
          '<div id="edmap" class="map-background" ng-class="{\'show-map\': vm.isMap()}" ng-style="style()" mapsize></div>' +
      '</div>',
      controller: 'GalaxyMapCtrl',
      controllerAs: 'vm',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
      }
    };
  });

  angular.module('clientApp')
  .controller('GalaxyMapCtrl', function ($state, $compile, $scope, $timeout, $window, entries, $firebaseArray, loaderSvc) {
      var vm = this;
      vm.entries = [];
      vm.mapData = [];
      vm.isMap = isMap;

      function isMap() {
          var state = $state.current.name;
          if (state === 'root.map') {
              return true;
          } else {
              return false;
          }
      }

      function init() {
          loaderSvc.toggleOnText('Generating map..');
          loadUserEntries();
      }

      function loadUserEntries() {
          vm.entries = $firebaseArray(entries.getUserEntries());
          $timeout(function() {
              buildMapObject(vm.entries);
          }, 4000);
      }

      function buildMapObject(entries) {
          var entriesWithSystem = _.filter(entries, 'system');
          var sugaredEntriesWithSys = _.forEach(entriesWithSystem, function(item, index) {
              item.system.infos = item.message;
          });
          vm.mapData = _.map(sugaredEntriesWithSys, 'system');
          loadMap();
          loaderSvc.toggleOff();
      }

      function loadMap() {
          $window.Ed3d.init({
              container   : 'edmap',
              // jsonPath    : "http://www.edsm.net/api-v1/systems?coords=1&known=1&startdatetime="+queryDate,
              // jsonPath    : "../data/map-en.json",
              // jsonPath    : "../data/galnet.json",
              json: vm.mapData,
              withFullscreenToggle: false,
              popupDetail: true,
              withOptionsPanel: true,
              withHudPanel : true,
              hudMultipleSelect : true,
              effectScaleSystem : [5,3000],
              startAnim: true,
              showGalaxyInfos : true,
              systemColor: '#22AA22',
              playerPos: [0, 0, 0],
              cameraPos: [-12000, 12000, -20000]
          });
      }

      init();
  });
