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
        scope: {},
        template: '<div class="">' +
        '<div id="edmap" class="map-background show-map" ng-style="style()" mapsize></div>' +
        '</div>',
        controller: 'GalaxyMapCtrl',
        controllerAs: 'vm',
        restrict: 'EA',
        bindToController: true
    };
});

angular.module('clientApp')
.controller('GalaxyMapCtrl', function ($state, $compile, $scope, $timeout, $window, entries, $firebaseArray, loaderSvc) {
    var vm = this;
    vm.entries = [];
    vm.mapData = [];
    vm.mapSkeleton = {
        "categories": {
            "Factions": {
                "0": {
                    color: 'EF0604',
                    name: 'Federation'
                },
                "1": {
                    color: '08A5F2',
                    name: 'Empire'
                },
                "2": {
                    color: '07F41C',
                    name: 'Alliance'
                },
                "3": {
                    color: '646766',
                    name: 'none'
                }
            }
        },
        "systems": []
    };

    function init() {
        // loaderSvc.toggleOnText('Creating galaxy..');
        loadUserEntries();
    }

    function loadUserEntries(refresh) {
        vm.entries = $firebaseArray(entries.getUserEntries());
        $timeout(function() {
            buildMapObject(vm.entries, refresh);
        }, 2000);
    }

    function buildMapObject(entries, refresh) {
        var entriesWithSystem = _.filter(entries, 'system');
        var sugaredEntriesWithSys = _.forEach(entriesWithSystem, function(item, index) {
            item.system.infos = item.message;
        });
        vm.mapData = _.map(sugaredEntriesWithSys, function(item) {
            var newItem = item.system;
            newItem.faction = item.faction || '';
            return newItem;
        });
        vm.mapSkeleton.systems = vm.mapData;
        vm.mapSkeleton.systems = _.map(vm.mapSkeleton.systems, function(item) {
            if (item.faction.name === 'Federation') {
                item.cat = [];
                item.cat.push(0);
            } else if (item.faction.name === 'Empire') {
                item.cat = [];
                item.cat.push(1);
            } else if (item.faction.name === 'Alliance') {
                item.cat = [];
                item.cat.push(2);
            } else {
                item.cat = [];
                item.cat.push(3);
            }
            return item;
        });
        vm.mapData = vm.mapSkeleton;
        if (refresh === true) {
            var options = {
                json: vm.mapData
            };
            $window.Ed3d.rebuild(options);
        } else {
            loadMap();
        }

        // loaderSvc.toggleOff();
    }

    function loadMap() {
        $window.Ed3d.init({
            container   : 'edmap',
            // jsonPath    : "http://www.edsm.net/api-v1/systems?coords=1&known=1&startdatetime="+queryDate,
            // jsonPath    : "../data/map-en.json",
            // jsonPath    : "../data/galnet.json",
            json: vm.mapData,
            withFullscreenToggle: false,
            popupDetail: false,
            withOptionsPanel: true,
            withHudPanel : true,
            hudMultipleSelect : true,
            effectScaleSystem : [5,3000],
            startAnim: true,
            showGalaxyInfos : true,
            systemColor: '#02E8AA',
            playerPos: [0, 0, 0],
            cameraPos: [-12000, 12000, -20000]
        });
    }

    //recieves prompt to get new user entry data and update map
    $scope.$on('refresh-map', function(event, args) {
        loadUserEntries(true);
    });

    init();
});
