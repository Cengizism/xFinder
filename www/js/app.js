'use strict';

angular.module('xFinder', ['ionic', 'xFinder.controllers', 'xFinder.services', 'ngResource'])

  .constant('$config', {
    host: 'https://desolate-sierra-8522.herokuapp.com/locations', // 'http://still-atoll-8938.herokuapp.com/api/locations'
    delay: 500,
    navigator: {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    },
    map: {
      zoom: 16
    }
  })

  .run(function ($rootScope, $ionicPlatform, Location) {
    Location.detect().then(function (position) {
      console.log('Fetching user position was successful. Coordinates are (', position.coords.latitude, ',', position.coords.longitude, '). More or less ' + position.coords.accuracy + ' meters.');
      $rootScope.position = position;
    }, function (err) {
      console.error('Fetching user location is failed!', err);
    });

    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        StatusBar.styleLightContent();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })
      .state('tab.locations', {
        url: '/locations',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-locations.html',
            controller: 'LocationsCtrl'
          }
        }
      })
      .state('tab.location-detail', {
        url: '/locations/:locationId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/location-detail.html',
            controller: 'LocationDetailCtrl'
          }
        }
      })
      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/locations');
  })

  .filter('capitalize', function () {
    return function (input) {
      if (input !== null) {
        input = input.toLowerCase();
      }

      return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
  });
