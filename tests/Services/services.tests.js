describe('Location Service', function () {
  var scope, Location, httpBackend;

  beforeEach(module('ngResource', 'ionic', 'xFinder.controllers', 'xFinder.services'));

  beforeEach(inject(function ($rootScope, _Location_, _$httpBackend_) {
    scope = $rootScope.$new();
    Location = _Location_;
    httpBackend = _$httpBackend_;
  }));

  it('can get an instance of my factory', inject(function (Location) {
    expect(Location).toBeDefined();
  }));

  it('should calculate distance', inject(function (Location) {
    expect(Math.round(Location.distance(0, 0, 1, 1))).toEqual(157);
  }));

  it('should grab a feed for stations with query of "utrecht"', inject(function (Location) {
    httpBackend.whenGET('https://desolate-sierra-8522.herokuapp.com/locations/stations?q=utrecht').respond(DATA);

    Location.feed({
      q: 'utrecht',
      type: 'stations'
    }).then(function (results) {
      expect(results.locations.length).toEqual(9);
    });

    httpBackend.flush();
  }));
});