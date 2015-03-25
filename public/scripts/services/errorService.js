(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('ErrorService', ErrorService);

  function ErrorService() {
    return {
      errorMessage: 'default',
      setError: function(msg) {
        this.errorMessage = msg;
      },
      clear: function() {
        this.errorMessage = null;
      }
    };
  } 
})();