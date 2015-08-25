(function(){
  'use strict'

  angular
    .module('projectMateApp')
    .directive('responsiveView', responsiveView);

  responsiveView.$inject = ['$window'];

  function responsiveView($window) {
    var directive = {
      restrict: 'A',
      scope: {
        breakpoint: '@responsiveView'
      },
      link: linkFunc      
    };

    return directive;

    function linkFunc(scope, element, attrs) {

      scope.calcView = function() {
        scope.isInView = ($window.innerWidth < scope.breakpoint) ? 1 : 0;
      };

      angular.element($window).bind('resize', function() {
        scope.calcView();
        console.log(scope.isInView);
        scope.$apply();
      });
    }
  }
})();
