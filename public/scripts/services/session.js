(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('Session', Session);

  Session.$inject = ['$window'];

  function Session($window){

    return {user: $window.user};
  }
})();