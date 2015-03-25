(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .directive('pwdConfirm', pwdConfirm);

  function pwdConfirm() {
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        pwdToCheck: '@pwdConfirm'
      },
      link: linkFunc
    }

    function linkFunc(scope, element, attrs, ctrl) {
        ctrl.$validators.pwdConfirm = function(modelValue) {
          if (modelValue === scope.pwdToCheck) {
            return true;
          }
          return false;
        };
      }
  }
})();

