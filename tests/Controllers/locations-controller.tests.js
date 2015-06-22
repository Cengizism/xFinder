describe('Locations Controller', function () {
  var scope;
  var Location;

  beforeEach(module('ngResource'));
  beforeEach(module('xFinder.controllers'));
  beforeEach(module('xFinder.services'));

  beforeEach(inject(function ($rootScope, $controller, _Location_) {
    scope = $rootScope.$new();
    Location = _Location_;
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

  // Test search fn
});