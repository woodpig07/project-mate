(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('TaskService', TaskService);

  TaskService.$inject = ['$resource', '$http'];
  
  function TaskService($resource,$http){
    var task = $resource('/api/tasks/:id',
                            {id:'@id'},
                            {update: {method: 'PUT'}});

    task.addTask = function(newTask){
      return $http.post('/api/tasks', newTask);
    }

    return task;
  }
})();
