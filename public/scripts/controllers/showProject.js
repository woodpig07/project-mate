(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('ShowProjectCtrl',ShowProjectCtrl);

  ShowProjectCtrl.$inject = ['Organizations','ProjectService','Session','$log'];

  function ShowProjectCtrl(Organizations,ProjectService,Session,$log) {
    var vm = this;

    vm.projects = null;
    vm.organizations = Session.user.organizations;

    vm.loadProjects = function(orgId){
      // setOrg(orgId);
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

    // function setOrg(orgId){
    //   OrganizationPointer.setOrganization(orgId);
    // };

  }
})();
