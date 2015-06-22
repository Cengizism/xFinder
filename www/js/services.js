'use strict';

angular.module('xFinder.services', [])
  .factory('Location', function ($rootScope, $resource, $q) {

    var Location = $resource(
      'https://desolate-sierra-8522.herokuapp.com/locations' + '/:type',
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
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });

      return deferred.promise;
    };

    Location.prototype.distance = function (latitude1, longitude1, latitude2, longitude2) {
      var deg2rad = function (deg) {
        return deg * (Math.PI / 180)
      };

      var R = 6371,
        dLatitude = deg2rad(latitude2 - latitude1),
        dLongitude = deg2rad(longitude2 - longitude1);

      var a = (Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2)) + (Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) * Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2));

      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    Location.prototype.feed = function (query) {
      var deferred = $q.defer();

      Location.query(query, function (results) {
          if ($rootScope.position !== null) {
            angular.forEach(results.locations, function (location) {
              location.distance = Math.round(Location.prototype.distance($rootScope.position.coords.latitude, $rootScope.position.coords.longitude, location.lat, location.lng));
            });
          }

          deferred.resolve(results);
        }, function (err) {
          deferred.reject(err);
        }
      );

      return deferred.promise;
    };

    return new Location();
  });