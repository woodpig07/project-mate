(function() {
  'use strict';

  angular.module('projectMateApp')
    .controller('RegisterCtrl', RegisterCtrl);

  RegisterCtrl.$inject = ['$scope','$location','$http', 'Session','ErrorService', '$log', '$window'];

  function RegisterCtrl($scope,$location,$http, Session,ErrorService, $log, $window) {
    var vm = this;
    vm.submitted = false;
    vm.errorService = ErrorService;

    vm.register = function(user) {
      if ($scope.registerForm.$valid) {
        
        if(!user.displayname){
          user.displayname = user.username;
        }
        var newUser = {username:user.username, password:user.password, displayname:user.displayname};
        $http.post('/auth/signup',newUser).success(function(data){
          $log.debug('RegisterCtrl -> register() -> POST()');
          $log.debug(data);
          Session.user = data;
          $location.path('/home');
          $window.location.reload();
        })
        .error(function(data){
          $log.debug('RegisterCtrl -> register() -> POST() :: ERROR');
          $log.debug(data);
          vm.errorService.setError(data.message);
  
        });
      }else{
        vm.submitted = true;
      }      
    };
  }

})();

