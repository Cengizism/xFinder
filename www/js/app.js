'use strict';

/**
 * Main angular application definition.
 */
angular.module('xFinder', ['ionic', 'xFinder.controllers', 'xFinder.services', 'ngResource'])

/**
 * Application controller.
 *
 * @param {!angular.$rootScope} $rootScope
 * @param {!angular.$scope} $scope
 * @param {!xFinder.services} Location
 */
  .run(function ($rootScope, $ionicPlatform, Location) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        StatusBar.styleLightContent();
      }

      $rootScope.position = undefined;

      var detect = function () {
        Location.detect().then(function (position) {
          console.log('Fetching user position was successful. Coordinates are (', position.coords.latitude, ',', position.coords.longitude, '). More or less ' + position.coords.accuracy + ' meters.');
          $rootScope.position = position;
        }, function (err) {
          console.error('Fetching user location is failed!', err);
          detect();
        });
      };
      detect();
    });
  })

/**
 * State machine definitions with controllers & templates.
 *
 * @param {!$stateProvider} $stateProvider
 * @param {!$urlRouterProvider} $urlRouterProvider
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

/**
 * Some handy filters.
 *
 * @param {string} input
 * @return {string}
 */
  .filter('capitalize', function () {
    return function (input) {
      if (input !== null) {
        input = input.toLowerCase();
      }

      return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
  });
