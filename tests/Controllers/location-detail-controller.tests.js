describe('Location Detail Controller', function () {
  var scope;
  var Location;
  // var stateParams;

  beforeEach(module('ngResource'));
  beforeEach(module('ionic'));
  beforeEach(module('xFinder.controllers'));
  beforeEach(module('xFinder.services'));

  // beforeEach(inject(function ($rootScope, $controller, _Location_, $stateParams) {
  beforeEach(inject(function ($rootScope, $controller, _Location_) {
    scope = $rootScope.$new();
    Location = _Location_;

    // $stateParams.locationId = 1;

    $controller('LocationDetailCtrl', {$scope: scope});
  }));

  //it('should pick up the right one from the list', function () {
  //  var location = {
  //    name: 'Utrecht Centraal',
  //    type: 'station',
  //    typeNumber: 100,
  //    lat: '52.08889',
  //    lng: '5.1102777',
  //    secondaryName: ''
  //  };
  //
  //  expect(true).toEqual(true);
  //});

  // How to test map functions?
});