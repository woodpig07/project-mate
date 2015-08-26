(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('ProjectOperationCtrl',ProjectOperationCtrl);

  ProjectOperationCtrl.$inject = ['$log','ProjectService', 'TaskService', 'notifications'];

  function ProjectOperationCtrl($log,ProjectService, TaskService, notifications) {  
    var vm = this;

    vm.projectTreeData = {
        projectId: null,
        isRoot: true,
        subTasks: []
      };
    // vm.tasks = $scope.projectTreeData;

    vm.remove = function(p, idx){
      $log.debug('ProjectOperationCtrl -> remove(this node) :');
      $log.debug(p);

      if (!p.isRoot) {
        //not root level
        var taskId = p.subTasks[idx]._id;
        
        TaskService.remove({id:taskId})
                    .$promise
                    .then(function(res){
                      $log.debug('ProjectOperationCtrl -> remove() -> TaskService.remove()');
                      $log.debug(res);
                      p.subTasks.splice(idx,1);
                      notifications.showSuccess({message: 'Your task removed successfully'});

                    },
                    function(error){
                      $log.debug('ProjectOperationCtrl -> remove() -> TaskService.remove() :: ERROR');
                      $log.debug(error);
                      notifications.showError({message: "something wrong when removing this task: " + error.data.message});

                    });
      } else {
        //root level
        var projectId = p.projectId;
        var taskId = p.subTasks[idx]._id;
        TaskService.remove({id:taskId})
                      .$promise
                      .then(function(res){
                        $log.debug('ProjectOperationCtrl -> remove() -> TaskService.remove()');
                        $log.debug(res);
                        p.subTasks.splice(idx,1);
                        notifications.showSuccess({message: 'Your task removed successfully'});

                      },
                      function(error){
                        $log.debug('ProjectOperationCtrl -> remove() -> TaskService.remove() :: ERROR');
                        $log.debug(error);
                        notifications.showError({message: "something wrong when removing this task" + error.data.message});
                      });
        
      }
    };
    vm.add = function(node,newNode){
      $log.debug('adding this node'+node);

      if (node.isRoot) {
        //add first level tasks
        newNode.parentProject = node.projectId;
        TaskService.addTask(newNode).then(function(res){
          $log.debug('ProjectOperationCtrl -> add() ->root-> TaskService.addTask() ');
          $log.debug(res);
          var newTaskId = res.data._id;
          var newTask = {
            id:res.data._id,
            taskName:res.data.taskName,
            startDate:res.data.startDate,
            description:res.data.description,
            duration:res.data.duration,
            subTasks:[],
            createDate:res.data.created,
            parentProject:res.data.parentProject
          };
          node.subTasks.push(newTask);
          notifications.showSuccess({message: 'Your task posted successfully'});
        },
        function(error){
          $log.debug('ProjectOperationCtrl -> add() ->root-> TaskService.addTask() :: ERROR');
          $log.debug(error);
          notifications.showError({message: "something wrong when adding this task" + error.data.message});          
        });        
      } else {
        //add non-first-level task
        newNode.parentTask = node._id;
        newNode.parentProject = node.parentProject;

        TaskService.addTask(newNode).then(function(res){
          $log.debug('ProjectOperationCtrl -> add() ->not root-> TaskService.addTask() ');
          $log.debug(res);
          var newTaskId = res.data._id;

          var newTask = {
            id:res.data._id,
            taskName:res.data.taskName,
            startDate:res.data.startDate,
            description:res.data.description,
            duration:res.data.duration,
            subTasks:[],
            createDate:res.data.created,
            parentProject:res.data.parentProject
          };
          if (node.subTasks && angular.isArray(node.subTasks)) {
          node.subTasks.push(newTask);
          } else {
            node.subTasks = [];
            node.subTasks.push(newTask);
          }
          notifications.showSuccess({message: 'Your task posted successfully'});
        },
        function(error){
          $log.debug('ProjectOperationCtrl -> add() ->not root-> TaskService.addTask() :: ERROR');
          $log.debug(error);
          notifications.showError({message: "something wrong when adding this task" + error.data.message});
        });
        
      }
        
    };
    vm.update = function(node,item){
      node.taskName = item.taskName;
      node.description = item.description;
      node.startDate = item.startDate;
      node.duration = item.duration;
      TaskService.update({id:node._id}, node)
                  .$promise
                  .then(function(res){
                    $log.debug('ProjectOperationCtrl -> update() ->root-> TaskService.update()');
                    $log.debug('task update'+res);
                    notifications.showSuccess({message: 'Your task updated successfully'});

                  },function(error){
                    $log.debug('ProjectOperationCtrl -> update() ->root-> TaskService.update() :: ERROR');
                    $log.debug(error);
                    notifications.showError({message: "something wrong when updating this task" + error.data.message});
                  });
    };    
  }

})();

