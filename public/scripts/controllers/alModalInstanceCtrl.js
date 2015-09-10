(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('alModalInstanceCtrl',alModalInstanceCtrl);

  alModalInstanceCtrl.$inject = ['$modalInstance'];

  function alModalInstanceCtrl($modalInstance) {
    var vm = this;
    vm.backHome = function(){
      $modalInstance.close("/home");
    };
    vm.logout = function(){
      $modalInstance.close("/logout");
    }; 
  }

})();
