(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('AuthService', AuthService);

  AuthService.$inject = ['$http', 'Session','$q','$log','User'];

  function AuthService($http, Session,$q,$log,User) {

    var authService = {};

    authService.login = function(credentials){

      var deferred = $q.defer();
      $http
        .post('/auth/signin',credentials)
        .success(function(data,status,headers, config){
          $log.debug('authService -> login()');
          $log.debug(data);
          Session.user = data;
          deferred.resolve(data);

        })
        .error(function(data,status,header,config){
          $log.debug('authService -> login() :: ERROR');
          $log.debug(data);
          deferred.reject(data);
        });

      return deferred.promise;
    };

    authService.logout = function(){
      return $http.get('/auth/signout');
    };

    authService.isAuthenticated = function(){
      return !!Session.user;
    };

    authService.isAuthorized = function(authorizedOrg, authorizedRoles){
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
        authorizedOrg === Session.userOrg &&
        authorizedRoles.indexOf(Session.userRole) !== -1); 
    }
    return authService;

  }
})();