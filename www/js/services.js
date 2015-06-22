'use strict';

// Services module.
angular.module('xFinder.services', [])

/**
 * Location service.
 *
 * @param {!angular.$rootScope} $rootScope
 * @param {!$resource} $resource
 * @param {!$q} $q
 */
  .factory('Location', function ($rootScope, $resource, $q) {
    // Setup Location resource with RESTful methods and endpoints
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

    /**
     * Detect user geo-location.
     *
     * @return {object}
     */
    Location.prototype.detect = function () {
      var deferred = $q.defer();

      // Use browsers geo-locator for location
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

    /**
     * Calculate approx. the distance between two coordinates.
     *
     * @param {number} latitude1
     * @param {number} longitude1
     * @param {number} latitude2
     * @param {number} longitude2
     * @return {number}
     */
    Location.prototype.distance = function (latitude1, longitude1, latitude2, longitude2) {
      var deg2rad = function (deg) {
        return deg * (Math.PI / 180)
      };

      var R = 6371,
        dLatitude = deg2rad(latitude2 - latitude1),
        dLongitude = deg2rad(longitude2 - longitude1);

      var d = (Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2)) + (Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) * Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2));

      return R * (2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d)));
    };

    /**
     * Grab a queried search results list from backend
     *
     * @param {object} query.
     * @return {object}
     */
    Location.prototype.feed = function (query) {
      // Create a promise
      var deferred = $q.defer();

      // Initialize the call
      Location.query(query, function (results) {
          // Calculate the distance of result to the user if the geo-location is absent
          if ($rootScope.position !== undefined) {
            angular.forEach(results.locations, function (location) {
              location.distance = Math.round(Location.prototype.distance($rootScope.position.coords.latitude, $rootScope.position.coords.longitude, location.lat, location.lng));
            });
          }

          // Return some results
          deferred.resolve(results);
        }, function (err) {
          deferred.reject(err);
        }
      );

      // Promise some results
      return deferred.promise;
    };

    return new Location();
  });