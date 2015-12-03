(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('AddOrganizationCtrl',AddOrganizationCtrl);

  AddOrganizationCtrl.$inject = ['Session','Organizations', 'notifications', '$log'];

  function AddOrganizationCtrl(Session, Organizations, notifications, $log) {
    var vm = this;
    vm.loading = false;

    vm.addNewOrg = function(newOrg) {
      vm.loading = true;

      Organizations.addOrg(newOrg)
          .then(function(res){
            $log.debug('AddOrganizationCtrl -> addNewOrg() -> Organizations.addOrg()');
            $log.debug(res);
            var addedOrg = {orgId: res._id, orgName: res.orgName, orgRole: "admin"};
            Session.user.organizations.push(addedOrg);
            vm.resetForm(newOrg);

            notifications.showSuccess({message: 'Your organization posted successfully'});
          },
          function(error){
            $log.debug('AddOrganizationCtrl -> addNewOrg() -> Organizations.addOrg() :: ERROR');
            $log.debug(error);
            notifications.showError({message: "something wrong when adding this organization" + error.data.message});
          })
          .finally(function() {
            vm.loading = false;
          });
    };

    vm.resetForm = function(newOrg) {
      newOrg.orgName = "";
      newOrg.description = "";
    };

  }

})();