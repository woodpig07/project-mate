(function(){
  'use strict'

  angular
    .module('projectMateApp')
    .directive('flowchartWrapper', flowchartWrapper);

  flowchartWrapper.$inject = [];

  function flowchartWrapper() {
    var directive = {
      restrict: 'A',
      scope: {
        config: "@"
      },
      compile: compileFunc      
    };

    return directive;

    function compileFunc(tElement, tAttributes, transclude) {

      return function(scope, element, attrs) {

        var flowchartConfig = {
          "line-color": "#777777",
          "element-color": "#777777",
          "symbols": {
            "start": {
              "fill": "yellow"
            },
            "end": {
              "fill": "yellow"
            },
            "operation": {
              "fill": "#39c"
            },
            "condition": {
              "fill": "rgb(88, 196, 163)"
            }
          }
        }                             
        
        var diagram = flowchart.parse(attrs.flowchartWrapper);
        diagram.drawSVG(attrs.id, flowchartConfig);
      }
    }
  }
})();