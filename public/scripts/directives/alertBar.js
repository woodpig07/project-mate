(function(){
  'use strict'

  angular
    .module('projectMateApp')
    .directive('alertBar', alertBar);

  function alertBar() {
    var directive = {
      restrict: 'EA',
      template: '<div class="alert alert-error"' +
        'ng-show="errorMessage">' +
        '{{errorMessage}}</div> ',
      link: linkFunc      
    };

    return directive;

    function linkFunc(scope, element, attrs) {
      var alertMessageAttr = attrs['alertmessage'];
      scope.errorMessage = null;
      scope.$watch(alertMessageAttr, function(newVal ) {
        scope.errorMessage = newVal;
      });      
    }
  }
})();

