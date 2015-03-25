(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('AddOrganizationCtrl',AddOrganizationCtrl);

  AddOrganizationCtrl.$inject = ['Session','Organizations','$log'];

  function AddOrganizationCtrl(Session, Organizations,$log) {
    var vm = this;

    vm.addNewOrg = function(newOrg) {
      Organizations.addOrg(newOrg)
          .then(function(res){
            $log.debug('AddOrganizationCtrl -> addNewOrg() -> Organizations.addOrg()');
            $log.debug(res);

          },
          function(error){
            $log.debug('AddOrganizationCtrl -> addNewOrg() -> Organizations.addOrg() :: ERROR');
            $log.debug(error);
          });
    };

  }

})();