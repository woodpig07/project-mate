(function() {
  'use strict';
  angular
    .module('projectMateApp')
    .controller('LogoutCtrl', LogoutCtrl);

  LogoutCtrl.$inject = ['$location','$rootScope','Session', 'AuthService','AUTH_EVENTS','$log'];
  function LogoutCtrl($location,$rootScope, Session, AuthService,AUTH_EVENTS,$log) {
    AuthService.logout().then(function(res){
      $log.debug('LogoutCtrl -> logout');
      Session.user = null;
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
      $location.path('/');
      
    })
  }

})();