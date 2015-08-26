// A hack to solve focus bug on angular bootstrap UI modale.
// https://github.com/fraywing/textAngular/issues/503

(function(){
  'use strict'

  angular
    .module('projectMateApp')
    .directive('stopEvent', stopEvent);

  stopEvent.$inject = ['$window'];

  function stopEvent($window) {
    var directive = {
      restrict: 'A',
      link: linkFunc      
    };

    return directive;

    function linkFunc(scope, element, attrs) {

      element.on(attrs.stopEvent, function(event) {
        event.stopPropagation();
      });
    }
  }
})();