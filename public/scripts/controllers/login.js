(function() {
  'use strict';
  angular
    .module('projectMateApp')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope','$rootScope','$location','AuthService','AUTH_EVENTS', 'Session','$log', "$modal"];
  function LoginCtrl($scope,$rootScope,$location,AuthService,AUTH_EVENTS, Session,$log, $modal) {
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
        }

        );
      }else{
        vm.submitted = true;
      }
    };

    $scope.$on('$routeChangeSuccess', function(event, current, previous) {

      if (AuthService.isAuthenticated()) {
        var modal = $modal.open({
          animation: true,
          templateUrl: "../../views/alreadyLoggedinModal.html",
          controller: "alModalInstanceCtrl",
          controllerAs: "alModalInstanceCtrl"
        });

        modal.result.then(function(newPath){
          $location.path(newPath);
        }, function() {
          $log.info('Already Loggedin Modal dismissed at: ' + new Date());
          $location.path("/home");
        });
      }
    });
  }

})();
