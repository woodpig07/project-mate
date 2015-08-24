(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('ShowProjectCtrl',ShowProjectCtrl);

  ShowProjectCtrl.$inject = ['Organizations','ProjectService','Session','$log'];

  function ShowProjectCtrl(Organizations,ProjectService,Session,$log) {
    var vm = this;

    vm.selectedOrgIdx = null;
    vm.isCollapsed = true;
    vm.projects = null;
    vm.organizations = Session.user.organizations;

    vm.loadProjects = function(orgId){
      // clean up scope projects
      vm.projects = null;

      ProjectService.query({parentOrg:orgId})
        .$promise
        .then(function(res){
          $log.debug('ShowProjectCtrl -> loadProjects() -> ProjectService.query()');
          $log.debug(res);
          vm.projects = res;

        },function(error){
          $log.debug('ShowProjectCtrl -> loadProjects() -> ProjectService.query() :: ERROR');
          $log.debug(error);
        });
    };
    // when click on organization name tag
    vm.handleClick = function(orgId, idx) {
      
      if (vm.selectedOrgIdx === idx) {
        vm.selectedOrgIdx = null;
        vm.isCollapsed = !vm.isCollapsed ;
      } else if (vm.selectedOrgIdx === null) {
        vm.selectedOrgIdx = idx;
        vm.isCollapsed = !vm.isCollapsed;
        vm.loadProjects(orgId);
      } else {
        vm.selectedOrgIdx = idx;
        vm.loadProjects(orgId);        
      }

    };
    // function setOrg(orgId){
    //   OrganizationPointer.setOrganization(orgId);
    // };

  }
})();
