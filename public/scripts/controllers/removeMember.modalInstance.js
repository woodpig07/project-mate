(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('RemoveMemberModalInstanceCtrl',RemoveMemberModalInstanceCtrl);

  RemoveMemberModalInstanceCtrl.$inject = ['$modalInstance','item'];

  function RemoveMemberModalInstanceCtrl($modalInstance,item) {
    var vm = this;
    vm.user = item.username;
    vm.confirm = function(){
      $modalInstance.close(item);
    };
    vm.cancel = function(){
      $modalInstance.dismiss('cancel');
    }; 
  }

})();
