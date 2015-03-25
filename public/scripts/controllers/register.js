(function() {
  'use strict';

  angular.module('projectMateApp')
    .controller('RegisterCtrl', RegisterCtrl);

  RegisterCtrl.$inject = ['$scope','$location','$http', 'User','ErrorService', '$log'];

  function RegisterCtrl($scope,$location,$http, User,ErrorService, $log) {
    var vm = this;
    vm.submitted = false;
    vm.errorService = ErrorService;
    // $scope.registerForm = function() {
    //   if ($scope.registerForm.$valid) {
    //     //TDD
    //   }else{
    //     $scope.registerForm.submitted = true;
    //   }

    // };

    vm.register = function(user) {
      if ($scope.registerForm.$valid) {
        
        if(!user.displayname){
          user.displayname = user.username;
        }
        var newUser = {username:user.username, password:user.password, displayname:user.displayname};
        $http.post('/auth/signup',newUser).success(function(data){
          $log.debug('RegisterCtrl -> register() -> POST()');
          $log.debug(data);
          $location.path('/login');
        })
        .error(function(data){
          $log.debug('RegisterCtrl -> register() -> POST() :: ERROR');
          $log.debug(data);
          vm.errorService.setError(data.errors);
  
        });
      }else{
        vm.submitted = true;
      }      
    };
  }

})();

