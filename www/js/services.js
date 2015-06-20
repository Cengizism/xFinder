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

    Location.prototype.feed = function (query) {
      var deferred = $q.defer();

      Location.query(query, function (results) {
          deferred.resolve(results);
        }, function (err) {
          deferred.reject(err);
        }
      );

      return deferred.promise;
    };

    return new Location();
  });