'use strict';

angular.module('xFinder.controllers', [])

  .controller('LocationsCtrl', function ($rootScope, $scope, $timeout, $config, $window, Location) {
    $scope.types = ['Cities', 'Streets', 'Stations', 'Places'];
    $scope.type = 'Stations';

    var timeout;

    var failed = function () {
      $scope.alert = {
        status: true,
        loading: false,
        message: 'Search failed! Please refine your query!'
      };
    };

    $scope.query = '';

    $scope.alert = {
      status: false,
      loading: true,
      message: ''
    };

    $scope.reset = function () {
      $window.location.reload();
    };

    $scope.search = function (query, type) {
      $scope.alert.status = false;

      if (query.length > 3) {
        $scope.alert = {
          status: true,
          loading: true,
          message: 'Loading some results..'
        };

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
          Location.feed({q: query, type: type.toLowerCase()}).then(function (results) {
            $scope.alert.status = false;

            if (results.error) {
              failed();
            }

            $rootScope.results = results.locations;
          }, function () {
            failed();
          });
        }, $config.delay);
      }
    };
  })

  .controller('LocationDetailCtrl', function ($rootScope, $scope, $stateParams, $ionicLoading, $compile, $config, Location) {
    $scope.location = $rootScope.results[$stateParams.locationId];

    var markers = [
      {
        title: 'You are here!',
        latitude: $rootScope.position.coords.latitude,
        longitude: $rootScope.position.coords.longitude
      },
      {
        title: $scope.location.name,
        latitude: $scope.location.lat,
        longitude: $scope.location.lng
      }
    ];

    var bounds = new google.maps.LatLngBounds(),
      map = new google.maps.Map(document.getElementById('map'), angular.extend($config.map, {mapTypeId: google.maps.MapTypeId.ROADMAP}));

    angular.forEach(markers, function (marker) {
      marker.obj = new google.maps.Marker({
        position: new google.maps.LatLng(marker.latitude, marker.longitude),
        map: map,
        title: marker.title,
        icon: 'img/icon-marker.png'
      });

      bounds.extend(marker.obj.position);

      marker.window = new google.maps.InfoWindow({content: $compile('<div>' + marker.title + '</div>')($scope)[0]});

      google.maps.event.addListener(marker.obj, 'click', function () {
        marker.window.open(map, marker.obj);
      });
    });

    map.fitBounds(bounds);

    // console.log('distance', Math.round(Location.distance(markers[0].latitude, markers[0].longitude, markers[1].latitude, markers[1].longitude)));
  })

  .controller('SettingsCtrl', function ($rootScope, $scope) {
    $scope.settings = {
      enableFriends: true
    };
  });