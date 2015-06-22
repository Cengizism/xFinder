describe('Location Detail Controller', function () {
  var scope, Location;

  beforeEach(module('ngResource', 'ionic', 'xFinder.controllers', 'xFinder.services'));

  beforeEach(inject(function ($rootScope, $controller, _Location_) {
    scope = $rootScope.$new();
    Location = _Location_;
    $controller('LocationDetailCtrl', {$scope: scope});
  }));

  it('should pick up the right one from the list', function () {
    var location = {
      name: 'Utrecht',
      type: 'station',
      typeNumber: 100,
      lat: '52.08889',
      lng: '5.1102777',
      secondaryName: ''
    };

    expect(DATA.locations[0]).toEqual(location);
  });

  // How to test map functions?
});