'use strict';

/**
 * @ngdoc filter
 * @name projectMateApp.filter:appFilter
 * @function
 * @description
 * # appFilter
 * Filter in the projectMateApp.
 */
angular.module('projectMateApp')
  .filter('appFilter', function () {
    return function (input) {
      return 'appFilter filter: ' + input;
    };
  });
