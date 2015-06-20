'use strict';

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngResource'])

  .run(function ($ionicPlatform) {
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

  .constant('$config', {
    // host: 'http://still-atoll-8938.herokuapp.com/api/locations',
    host: 'https://desolate-sierra-8522.herokuapp.com/locations',
    navigator: {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  });
