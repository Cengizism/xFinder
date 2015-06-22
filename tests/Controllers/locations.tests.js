describe('Locations Controller', function () {
  var scope, Location, httpBackend;

  beforeEach(module('ngResource', 'xFinder.controllers', 'xFinder.services'));

  beforeEach(inject(function ($rootScope, $controller, _Location_, _$httpBackend_) {
    scope = $rootScope.$new();
    Location = _Location_;
    httpBackend = _$httpBackend_;
    $controller('LocationsCtrl', {$scope: scope});
  }));

  it('should have complete listing of types', function () {
    expect(scope.types).toEqual(['Cities', 'Streets', 'Stations', 'Places']);
  });

  it('should set the default type', function () {
    expect(scope.type).toEqual('Stations');
  });

  it('should create an empty query variable', function () {
    expect(scope.query).toEqual('');
  });

  it('should create alert container', function () {
    var alert = {
      status: false,
      loading: true,
      message: ''
    };

    expect(scope.alert).toEqual(alert);
  });

  // TODO: Complete this!
  it('should make a search query', function () {
    //httpBackend.whenGET('https://desolate-sierra-8522.herokuapp.com/locations/stations?q=utrecht').respond(DATA);
    //scope.search('utrecht', 'stations');
    //expect(scope.results.length).toEqual(9);
    //httpBackend.flush();
    expect(true).toEqual(true);
  });
});