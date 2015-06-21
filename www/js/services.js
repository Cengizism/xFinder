'use strict';

angular.module('xFinder.services', [])
  .factory('Location', function ($rootScope, $resource, $q, $config) {
    var Location = $resource(
      $config.host + '/:type',
      {},
      {
        query: {
          method: 'GET',
          params: {}
        }
      }
    );

    Location.prototype.detect = function () {
      var deferred = $q.defer();

      navigator.geolocation.getCurrentPosition(function (position) {
        deferred.resolve(position);
      }, function error(err) {
        deferred.reject(err);
      }, $config.navigator);

      return deferred.promise;
    };

    Location.prototype.distance = function (lat1, lon1, lat2, lon2) {

      function deg2rad(deg) {
        return deg * (Math.PI / 180)
      }

      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);  // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;

    };

    Location.prototype.feed = function (query) {
      var deferred = $q.defer();

      Location.query(query, function (results) {

          angular.forEach(results.locations, function (location) {
            location.distance = Math.round(Location.prototype.distance($rootScope.position.coords.latitude, $rootScope.position.coords.longitude, location.lat, location.lng));
          });

          deferred.resolve(results);
        }, function (err) {
          deferred.reject(err);
        }
      );

      return deferred.promise;
    };

    return new Location();
  });