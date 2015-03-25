(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('errorHttpInterceptor',errorHttpInterceptor);

  errorHttpInterceptor.$inject = ['$q', '$rootScope', 'ErrorService','$log'];

  function errorHttpInterceptor($q, $rootScope, ErrorService,$log) {

    return {
      'response': function(response) {
        // console.log(response);
        return response;
      },
      'responseError': function(rejection){
        $log.debug('errorHttpInterceptor:'+rejection.status);
        if (rejection.status === 401) {
          ErrorService.setError('incorrect email or password');
          $rootScope.$broadcast('event:loginRequired');
        }else if (rejection.status>=400 && rejection.status < 500) {
          ErrorService.setError('unable to find what you were looking for...');
        } else if (rejection.status===403) {
          console.log('403');
          
        }

        return $q.reject(rejection);
      }
    };

  }
})();