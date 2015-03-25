(function() {
  'use strict';

  angular
      .module('projectMateApp')
      .factory('loadTask', loadTask);

  loadTask.$inject = ['$q','TaskService','$log'];

  function loadTask($q, TaskService, $log) {
    return {
      getTaskObject: getTaskObject
    };

    function getTaskObject(taskId,tempObj,deferred){
      if (!deferred) {
        deferred = $q.defer(); 
      }

      TaskService.get({id:taskId})
                  .$promise
                  .then(function(res){
                    $log.debug('loadTask -> getTaskObject() -> TaskService.get()');
                    $log.debug(res);
                    var task = {
                      _id:taskId,
                      taskName:res.taskName,
                      startDate:res.startDate,
                      duration:res.duration,
                      description:res.description,
                      subTasks:res.subTasks,
                      parentTask:res.parentTask,
                      parentProject:res.parentProject
                    };

                    if (tempObj && tempObj.subTasks) {

                      var i = tempObj.subTasks.indexOf(taskId);
                      tempObj.subTasks[i] = task;
                      tempObj = tempObj.subTasks[i];
                    } else {
                      tempObj = task;
                    }
                    


                    if (task.subTasks && angular.isArray(task.subTasks)){
                      angular.forEach(task.subTasks, function(t){
                        getTaskObject(t,tempObj,deferred);
                      });
                    }
                    $log.debug('loadTask -> getTaskObject() -> TaskService.get() -> tempObj');
                    $log.debug(tempObj);

                    deferred.resolve(tempObj);
                    

                  },
                  function(error){
                    $log.debug('loadTask -> getTaskObject() -> TaskService.get() ERROR:')
                    $log.debug(error);
                    deferred.reject('failed to get taskid'+taskId);
                  });

      return deferred.promise;
    }

  }
})();