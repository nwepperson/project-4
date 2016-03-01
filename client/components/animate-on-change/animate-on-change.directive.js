(function () {
  'use strict';

  angular.module('movieShareApp')
  .directive('animateOnChange', function($timeout) {
    return function(scope, element, attr) {
      scope.$watch(attr.animateOnChange, function(nv,ov) {
        if (nv !== ov) {
          element.addClass('changed');
          $timeout(function() {
            element.removeClass('changed');
          }, 1000);
        }
      });
    };
  });
})();
