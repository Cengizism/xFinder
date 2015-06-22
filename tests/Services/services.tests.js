describe('Location Unit Tests', function () {
  var Location;
  
  beforeEach(module('ngResource'));
  beforeEach(module('ionic'));
  beforeEach(module('xFinder.controllers'));
  beforeEach(module('xFinder.services'));

  beforeEach(inject(function (_Location_) {
    Location = _Location_;
  }));

  it('can get an instance of my factory', inject(function (Location) {
    expect(Location).toBeDefined();
  }));

  //it('has 5 chats', inject(function(Friends) {
  //  expect(Friends.all().length).toEqual(5);
  //}));
  //
  //it('has Max as friend with id 1', inject(function(Friends) {
  //  var oneFriend = {
  //    id: 1,
  //    name: 'Max Lynx',
  //    notes: 'Odd obsession with everything',
  //    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&amp;s=460'
  //  };
  //
  //  expect(Friends.get(1).name).toEqual(oneFriend.name);
  //}));
});