'use strict';

angular.module('xFinder.controllers', [])

  .controller('LocationsCtrl', function ($rootScope, $scope, $config, Location) {
    $scope.types = ['Cities', 'Streets', 'Stations', 'Places'];
    $scope.type = 'Stations';

    $scope.failed = {
      status: false,
      message: ''
    };

    $scope.loading = false;

    $scope.q = '';

    var timeout;

    $scope.search = function (query, type) {
      $scope.failed.status = false;

      if (query.length > 3) {
        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
          $scope.loading = true;

          Location.feed({q: query, type: type.toLowerCase()}).then(function (results) {
            $scope.loading = false;

            if (results.error) {
              $scope.failed.status = true;
            }

            $rootScope.results = results.locations;
          }, function (err) {
            $scope.failed.status = true;
            $scope.failed.message = 'Server responded with: ' + err;
          });
        }, $config.delay);
      }
    };
  })

  .controller('LocationDetailCtrl', function ($rootScope, $scope, $stateParams, $ionicLoading, $compile) {
    $scope.location = $rootScope.results[$stateParams.locationId];

    //$scope.loading = $ionicLoading.show({
    //  content: 'Getting current location...',
    //  showBackdrop: false
    //});
    //$scope.loading.hide();

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
      map = new google.maps.Map(document.getElementById('map'), {mapTypeId: google.maps.MapTypeId.ROADMAP});

    angular.forEach(markers, function (marker) {
      marker.obj = new google.maps.Marker({
        position: new google.maps.LatLng(marker.latitude, marker.longitude),
        map: map,
        title: marker.title
      });

      bounds.extend(marker.obj.position);

      marker.window = new google.maps.InfoWindow({content: $compile('<div>' + marker.title + '</div>')($scope)[0]});

      google.maps.event.addListener(marker.obj, 'click', function () {
        marker.window.open(map, marker.obj);
      });
    });

    map.fitBounds(bounds);

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);  // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI / 180)
    }

    console.log('distance', getDistanceFromLatLonInKm(markers[0].latitude, markers[0].longitude, markers[1].latitude, markers[1].longitude));

  })

  .controller('SettingsCtrl', function ($rootScope, $scope) {
    $scope.settings = {
      enableFriends: true
    };
  });