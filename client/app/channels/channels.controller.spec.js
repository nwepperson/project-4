'use strict';

describe('Controller: ChannelsCtrl', function () {

  // load the controller's module
  beforeEach(module('movieShareApp'));

  var ChannelsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChannelsCtrl = $controller('ChannelsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
