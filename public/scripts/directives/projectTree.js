/**
 * Adapted from
 * adTreeBrowser https://github.com/Adaptv/adapt-strap/blob/master/src/treebrowser/treebrowser.js
 */
(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .directive('projectTree', projectTree);

    function projectTree() {
      return {
        restrict: 'EA',
        scope: true,
        controller:  controllerFunction,
        templateUrl: '../../views/projectTree/projectTree.html'
      }; 

      controllerFunction.$inject = ['$scope', '$attrs'];
      
      function controllerFunction($scope, $attrs) {

        $scope.iconClasses = {
            expand: 'glyphicon glyphicon-folder-close',
            collapse: 'glyphicon glyphicon-folder-open',
            loadingSpinner: 'glyphicon glyphicon-refresh ad-spin',
          };        
        // scope initialization
        $scope.attrs = $attrs;

        $scope.treeRoot = $scope.$eval($attrs.treeRoot) || {};
        $scope.toggle = function (event, item) {
          var toggleCallback;
          event.stopPropagation();
          toggleCallback = $scope.$eval($attrs.toggleCallback);
          if (toggleCallback) {
            toggleCallback(item);
          } else {
            item._ad_expanded = !item._ad_expanded;
          }
        };
        var hasChildren = $scope.$eval($attrs.hasChildren);
        $scope.hasChildren = function (item) {
          var found = item[$attrs.childNode] && item[$attrs.childNode].length > 0;
          if (hasChildren) {
            found = hasChildren(item);
          }
          return found;
        };
        $scope.isString = function(item){
          return angular.isString(item);
        };


      }      
    }
})();
