'use strict';

angular.module('starter.controllers', [])

  .controller('LocationsCtrl', [
    '$rootScope', '$scope', 'Chats', 'Location',
    function ($rootScope, $scope, Chats, Location) {
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

  .controller('LocationDetailCtrl', function ($rootScope, $scope, $stateParams) {
    $scope.location = $rootScope.results[$stateParams.locationId];
  })

  .controller('SettingsCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
