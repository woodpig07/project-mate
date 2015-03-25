(function() {
  'use strict';
  angular
    .module('projectMateApp')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope','$rootScope','$location','AuthService','AUTH_EVENTS', 'Session','$log'];
  function LoginCtrl($scope,$rootScope,$location,AuthService,AUTH_EVENTS, Session,$log) {
    var vm = this;

    vm.submitted = false;
    vm.login = function(credentials) {
      if ($scope.loginForm.$valid) {
          AuthService.login(credentials).then(function(res){
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $log.debug('LoginCtrl -> login() success');
            $log.debug(res);

            $location.path('/home');


          }, function(error){
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            $log.debug('LoginCtrl -> login() failed');
            vm.error = error.message;
            // $location.path('/');
        }

        );
      }else{
        vm.submitted = true;
      }
    };

  }

})();
