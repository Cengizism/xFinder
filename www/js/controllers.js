'use strict';

angular.module('starter.controllers', [])

  .controller('LocationsCtrl', [
    '$scope', 'Chats', 'Location',
    function ($scope, Chats, Location) {
      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      $scope.chats = Chats.all();

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




      $scope.types = ['cities', 'streets', 'stations', 'places'];
      $scope.type = 'stations';

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
              type: type
            }).then(function (list) {
              console.log('list:', list);

              $scope.loading = false;

              if (list.error) {
                $scope.failed.status = true;
              }

              console.log('list', list);

              $scope.list = list.locations;
            }, function (err) {
              $scope.failed.status = true;
              $scope.failed.message = 'Server responded with: ' + err;
            });
          }, 500);
        }

      };


    }])

  .controller('LocationDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('SettingsCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
