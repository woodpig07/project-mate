// let you do something before ng-repeat loop is done.

(function(){
  'use strict'

  angular
    .module('projectMateApp')
    .directive('repeatComplete', repeatComplete);

  repeatComplete.$inject = ['$rootScope'];

  function repeatComplete($rootScope) {
    var directive = {
      restrict: 'A',
      priority: 1001,
      compile: compileFunc      
    };

    var uuid = 0;

    return directive;

    function compileFunc(tElement, tAttrs) {
      var id = ++uuid;
      var completeExpression = tAttrs.repeatComplete;
      var parent = tElement.parent();
      var parentScope = (parent.scope() || $rootScope);

      tElement.attr("repeat-complete-id", id);

      tElement.removeAttr("repeat-complete");

      var unbindWatcher = parentScope.$watch(function() {
        console.info( "Digest running." );

        var lastItem = parent.children("*[repeat-complete-id='" + id + "']:last");

        if (!lastItem.length) {
          return;
        }

        var itemScope = lastItem.scope();

        if (itemScope.$last) {
          unbindWatcher();
          console.log("last");
          itemScope.$eval(completeExpression);
        }
      });

    }
  }
})();

