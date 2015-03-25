(function() {
  'use strict';

  angular.module('projectMateApp')
    .directive('editToSave', editToSave);

  function editToSave() {
    var templ = '<div ng-hide="view.editorEnabled">' +
          '{{val}}' +
          '<button type="button" class="btn btn-default btn-sm" ng-click="enableEditor()">Edit</button>' +
        '</div>' +
        '<form ng-show="view.editorEnabled" class="form-inline">' +
          '<div class="input-group">' +
            '<input ng-model="view.editableVal" class="form-control">' +
          '</div>' +
          '<button type="button" class="btn btn-default" ng-click="save(view.editableVal)">Save</button>' +
          '<button type="button" class="btn btn-default" ng-click="cancelEditor()">Cancel</button>' +
        '</form>';

    return {
      template: templ,
      restrict: 'EA',
      scope: {
        val: "@editToSave",
        saveFunc: '&saveto'
      },
      link: linkFunc
    };

    function linkFunc(scope, element, attrs) {
      scope.view = {
        editorEnabled: false
      };
      scope.enableEditor = function() {
        scope.view.editorEnabled = true;
        scope.view.editableVal = scope.val;
      };
      scope.cancelEditor = function() {
        scope.view.editorEnabled = false;
      };
      scope.save = function(newName) {
        var name = newName;
        var method = scope.saveFunc();
        method(name);
        scope.cancelEditor();    
      }  
    }   
  }
})();


