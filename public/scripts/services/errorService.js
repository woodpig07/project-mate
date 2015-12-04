(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('ErrorService', ErrorService);

  function ErrorService() {
    return {
      errorMessage: '',
      setError: function(msg) {
        this.errorMessage = msg;
      },
      clear: function() {
        this.errorMessage = null;
      }
    };
  } 
})();