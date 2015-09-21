(function(){
  'use strict'

  angular
    .module('projectMateApp')
    .directive('flowchartWrapper', flowchartWrapper);

  flowchartWrapper.$inject = [];

  function flowchartWrapper() {
    var directive = {
      restrict: 'A',
      compile: compileFunc      
    };

    return directive;

    function compileFunc(tElement, tAttributes, transclude) {

      return function(scope, element, attrs) {
        var diagram = flowchart.parse("st=>start: Start on Organization Page:>#/home/organization\n" +
                                      "e=>end:>http://www.google.com\n" +
                                      "op1=>operation: Managing/view organization membership:>#/home/organization\n" +
                                      "op2=>operation: Project overview:>#/home/project\n" +
                                      "sub1=>operation: Create new organization:>#/home/organization\n" +
                                      "cond1=>condition: Already in a organization\n" +
                                      "or No?:>#/home/organization\n" +
                                      "cond2=>condition: Have exiting project\n" +
                                      "st->cond1\n" +
                                      "cond1(yes)->op1\n" +
                                      "cond1(no)->sub1\n" +
                                      "op1->cond2\n" +
                                      "cond2(yes)->op2\n");

        diagram.drawSVG(attrs.id);
      }
    }
  }
})();