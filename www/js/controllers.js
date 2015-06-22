'use strict';

angular.module('xFinder.controllers', [])

  .controller('LocationsCtrl', function ($rootScope, $scope, Location) {
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
        }, 500);
      }
    };
  })

  .controller('LocationDetailCtrl', function ($rootScope, $scope, $stateParams, $ionicLoading, $compile) {
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
      map = new google.maps.Map(document.getElementById('map'),
        {
          zoom: 16,
          disableDefaultUI: true,
          styles: [{
            'featureType': 'landscape',
            'stylers': [{'hue': '#FFBB00'}, {'saturation': 43.400000000000006}, {'lightness': 37.599999999999994}, {'gamma': 1}]
          }, {
            'featureType': 'road.highway',
            'stylers': [{'hue': '#FFC200'}, {'saturation': -61.8}, {'lightness': 45.599999999999994}, {'gamma': 1}]
          }, {
            'featureType': 'road.arterial',
            'stylers': [{'hue': '#FF0300'}, {'saturation': -100}, {'lightness': 51.19999999999999}, {'gamma': 1}]
          }, {
            'featureType': 'road.local',
            'stylers': [{'hue': '#FF0300'}, {'saturation': -100}, {'lightness': 52}, {'gamma': 1}]
          }, {
            'featureType': 'water',
            'stylers': [{'hue': '#0078FF'}, {'saturation': -13.200000000000003}, {'lightness': 2.4000000000000057}, {'gamma': 1}]
          }, {
            'featureType': 'poi',
            'stylers': [{'hue': '#00FF6A'}, {'saturation': -1.0989010989011234}, {'lightness': 11.200000000000017}, {'gamma': 1}]
          }],
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

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
  })

  .controller('SettingsCtrl', function ($rootScope, $scope) {
    $scope.settings = {
      enableFriends: true
    };
  });