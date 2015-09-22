(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = [];

  function HomeCtrl() {
    var vm = this;

    vm.startGuideConfig = "st=>start: Start on Organization Page:>#/home/organization\n" +
                          "e=>end:>http://www.google.com\n" +
                          "op1=>operation: Managing/view organization membership:>#/home/organization\n" +
                          "op2=>operation: Project overview:>#/home/project\n" +
                          "op3=>operation: Listing projects by organization:>#/home/project\n" +
                          "op4=>operation: Managing tasks in project details page\n" +
                          "sub1=>operation: Create new organization:>#/home/organization\n" +
                          "sub2=>operation: Creating new projects:>#/home/project\n" +
                          "cond1=>condition: Already in a organization\n" +
                          "or No?:>#/home/organization\n" +
                          "cond2=>condition: Have exsiting project\n" +
                          "st->cond1\n" +
                          "cond1(yes)->op1\n" +
                          "cond1(no)->sub1(right)->op1\n" +
                          "op1->op2->cond2\n" +
                          "cond2(yes)->op3\n" +
                          "cond2(no)->sub2(right)->op3\n" +
                          "op3->op4";  
  }
})();