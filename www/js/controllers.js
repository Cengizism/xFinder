'use strict';

// Controllers module.
angular.module('xFinder.controllers', [])

/**
 * Locations controller.
 */
  .controller('LocationsCtrl', function ($rootScope, $scope, Location) {
    // Define query types
    $scope.types = ['Cities', 'Streets', 'Stations', 'Places'];

    // Select 'stations' as default type
    $scope.type = 'Stations';

    // Create a general failed function for alert messages
    var failed = function (message) {
      $scope.alert = {
        status: true,
        loading: false,
        message: message
      };
    };

    // Create an empty query container
    $scope.query = '';

    // Set defaults for alert object
    $scope.alert = {
      status: false,
      loading: true,
      message: ''
    };

    // Create results container
    $rootScope.results = [];

    /**
     * Make search queries in backend.
     */
    $scope.search = function (query, type) {
      // Turn off alerting at search beginning
      $scope.alert.status = false;

      // Only run if query has more than 3 characters
      if (query.length > 3) {
        // Inform user about searching
        $scope.alert = {
          status: true,
          loading: true,
          message: 'Loading some results..'
        };

        // If there is a timeout initialized already
        if ($scope.timeout) {
          // Clear the timeout
          clearTimeout($scope.timeout);
        }

        // Set a timeout for search delay
        $scope.timeout = setTimeout(function () {
          // Request a search feed from Location service
          Location.feed({q: query, type: type.toLowerCase()}).then(function (results) {
            $scope.alert.status = false;

            if (results.error) {
              failed('Search failed! Please refine your query!');
            }

            if (results.notFound) {
              failed('No results found!');
            }

            // Set the results in the view container
            $rootScope.results = results.locations;
          }, function () {
            failed();
          });
        }, 500);
      } else {
        $rootScope.results = [];
      }
    };
  })

/**
 * Locations detail controller.
 */
  .controller('LocationDetailCtrl', function ($rootScope, $scope, $stateParams, $compile) {
    // Create markers list
    var markers = [];

    // Grab the location based on the passed index
    if ($stateParams.locationId) {
      $scope.location = $rootScope.results[$stateParams.locationId];

      markers.push({
        title: $scope.location.name,
        latitude: $scope.location.lat,
        longitude: $scope.location.lng,
        icon: 'img/icon-marker.png'
      });
    }

    // Insert user location into the markers array if the geo-location is present
    if ($rootScope.position !== undefined) {
      markers.unshift({
        title: 'You are here!',
        latitude: $rootScope.position.coords.latitude,
        longitude: $rootScope.position.coords.longitude,
        icon: 'img/icon-marker-home.png'
      });
    }

    // Start initializing Google Maps
    if (markers.length > 0) {
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

      // Iterate markers list for creating marker objects in the map and determining the bounds
      angular.forEach(markers, function (marker) {
        marker.obj = new google.maps.Marker({
          position: new google.maps.LatLng(marker.latitude, marker.longitude),
          map: map,
          title: marker.title,
          icon: marker.icon
        });

        bounds.extend(marker.obj.position);

        marker.window = new google.maps.InfoWindow({content: $compile('<div>' + marker.title + '</div>')($scope)[0]});

        // Add some click listeners for the pop-ups
        google.maps.event.addListener(marker.obj, 'click', function () {
          marker.window.open(map, marker.obj);
        });
      });

      // Lay the markers in the window comfortably
      map.fitBounds(bounds);
    }
  })

/**
 * Settings controller.
 */
  .controller('SettingsCtrl', function ($rootScope, $scope) {
    $scope.settings = {
      enableFriends: true
    };
  });