'use strict';

angular.module('starter.controllers', [])

  .controller('LocationsCtrl', [
    '$rootScope', '$scope', 'Location',
    function ($rootScope, $scope, Location) {
      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      Location.detect().then(function (position) {
        console.log('position', position);

        //$scope.center.latitude = position.coords.latitude;
        //$scope.center.longitude = position.coords.longitude;
        //$scope.center.accuracy = 'More or less ' + position.coords.accuracy + ' meters.';
        //
        //$timeout(function () {
        //  $scope.markers.push({
        //    position: $scope.center.latitude + ', ' + $scope.center.longitude,
        //    click: function () { console.log('center has been clicked.'); },
        //    title: 'You are here!'
        //  });
        //});
      }, function (err) {
        console.error('err', err);

        //$scope.failed = {
        //  status: true,
        //  message: 'Location can not be detected! ' + err.code + ' : ' + err.message
        //};
      });


      $scope.types = ['Cities', 'Streets', 'Stations', 'Places'];
      $scope.type = 'Stations';

      $scope.list = null;

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

            Location.feed({
              q: query,
              type: type.toLowerCase()
            }).then(function (results) {
              console.log('list:', results);

              $scope.loading = false;

              if (results.error) {
                $scope.failed.status = true;
              }

              console.log('list', results);

              $rootScope.results = results.locations;
            }, function (err) {
              $scope.failed.status = true;
              $scope.failed.message = 'Server responded with: ' + err;
            });
          }, 500);
        }

      };


    }])

  .controller('LocationDetailCtrl', function ($rootScope, $scope, $stateParams, $ionicLoading, $compile) {
    $scope.location = $rootScope.results[$stateParams.locationId];


    $scope.init = function () {
      var myLatlng = new google.maps.LatLng(43.07493, -89.381388);

      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

      //Marker + infowindow + angularjs compiled ng-click
      var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
      var compiled = $compile(contentString)($scope);

      var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
      });

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Uluru (Ayers Rock)'
      });

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
      });

      $scope.map = map;
    };

    // google.maps.event.addDomListener(window, 'load', initialize);

    $scope.centerOnMe = function () {
      if (!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function (pos) {
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.loading.hide();
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    };

    $scope.clickTest = function () {
      alert('Example of infowindow with ng-click')
    };
  })

  .controller('SettingsCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });