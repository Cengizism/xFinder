'use strict';

// Main angular application definition.
angular.module('xFinder', ['ionic', 'xFinder.controllers', 'xFinder.services', 'ngResource'])

/**
 * Application controller.
 */
  .run(function ($rootScope, $ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        StatusBar.styleLightContent();
      }

      // Set position to undefined as default
      $rootScope.position = undefined;

      // Start detecting user location
      var detect = function () {
        // Use browsers geo-locator for location
        navigator.geolocation.getCurrentPosition(function (position) {
          console.log('Fetching user position was successful. Coordinates are (', position.coords.latitude, ',', position.coords.longitude, '). More or less ' + position.coords.accuracy + ' meters.');
          $rootScope.position = position;
        }, function error(err) {
          console.error('Fetching user location is failed!', err);
          detect();
        }, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      };
      detect();
    });
  })

/**
 * State machine definitions with controllers & templates.
 */
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      // Load tabs
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Locations
      .state('tab.locations', {
        url: '/locations',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-locations.html',
            controller: 'LocationsCtrl'
          }
        }
      })

      // Location detail
      .state('tab.location-detail', {
        url: '/locations/:locationId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/location-detail.html',
            controller: 'LocationDetailCtrl'
          }
        }
      })

      // Settings
      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsCtrl'
          }
        }
      });

    // Route fallback
    $urlRouterProvider.otherwise('/tab/locations');
  })

  // Some handy filter for capitalizing the first letter
  .filter('capitalize', function () {
    /**
     * Some handy filters.
     *
     * @param {string} input
     * @return {string}
     */
    return function (input) {
      if (input !== null) {
        input = input.toLowerCase();
      }

      return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
  });
