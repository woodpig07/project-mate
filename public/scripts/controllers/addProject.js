(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('AddProjectCtrl',AddProjectCtrl);

  AddProjectCtrl.$inject = ['Session','ProjectService','$log'];

  function AddProjectCtrl(Session,ProjectService,$log) {
    var vm = this;

    vm.isCollapsed = true;
    vm.success = null;
    vm.fail = null;
    vm.hideEditProject = true;

    vm.organizations = Session.user.organizations;

    vm.addNewProject = function(newProject){
      if(vm.selectedOrgId) {

        ProjectService.addProject(newProject, vm.selectedOrgId)
                      .then(function(res){
                        $log.debug('AddProjectCtrl -> addNewProject() -> ProjectService.addProject()');
                        $log.debug(res);

                      },
                      function(error){
                        $log.debug('AddProjectCtrl -> addNewProject() -> ProjectService.addProject() :: ERROR');
                        $log.debug(error);
                        vm.fail = 'failed to add project';
                      });
        
      } else {
        $log.error('addProject():'+"no org selected");
      }
    };

    vm.setSelectedOrg = function (orgId){
      $log.debug('AddProjectCtrl -> setSelectedOrg() -> orgId:');
      $log.debug(orgId);
      vm.selectedOrgId = orgId;
      vm.isCollapsed = !vm.isCollapsed;

    };
    vm.resetSelectedOrg = function (){

      vm.selectedOrgId = null;
      vm.isCollapsed = !vm.isCollapsed;

    };

    function resetMsg() {
      vm.success = null;
      vm.fail = null;
    }
  }

})();
