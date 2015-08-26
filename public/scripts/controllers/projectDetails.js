(function() {
  'use strict';
  angular
	.module('projectMateApp')
	.controller('ProjectDetailsCtrl',ProjectDetailsCtrl);

  ProjectDetailsCtrl.$inject = ['$routeParams','ProjectService','loadTask','User','$log'];

  function ProjectDetailsCtrl($routeParams,ProjectService,loadTask,User,$log) {
		var vm = this;
		// vm.orgId = OrganizationPointer.orgId;
		vm.loading = false;
		vm.projectId = $routeParams.projectId;
		vm.projectTreeData = {
			projectId: null,
			isRoot: true,
			subTasks: []
		};

		vm.refresh = function(){
		  $log.debug('refresh button clicked!');
		  vm.loading=true;
		  vm.projectTreeData.subTasks.length = 0;
		  loadCurrentProject();

		};
		vm.assignEditor = function(newEditor){

			if (vm.currentProject.editors.indexOf(newEditor)>=0){
				vm.hasError = true;
				vm.hasFeedback = true;
				vm.msg = newEditor + 'is already editor!';
			} else {

				User.query({username:newEditor})
					.$promise
					.then(function(u){
						$log.debug('ProjectDetailsCtrl -> assignEditor() -> User.query()');
						$log.debug(u);
						var user = u[0] ? u[0] : null;
						if (user) {
							user.organizations.forEach(function(o, i) {
								if (o.orgId===vm.orgId) {
									ProjectService.update({id:vm.projectId,$push:{editors:newEditor}})
										.$promise
										.then(function(res){
											$log.debug('ProjectDetailsCtrl -> assignEditor() -> User.get() -> ProjectService.update()');
											$log.debug(res);
											vm.hasSuccess = true;
											vm.hasFeedback = true;
											vm.currentProject.editors.push(newEditor);
										},function(error){
											$log.debug('ProjectDetailsCtrl -> assignEditor() -> User.get() -> ProjectService.update() :: ERROR');
											$log.debug(error);
											vm.hasError = true;
											vm.hasFeedback = true;
										});

								} else if (i === (user.organizations.length-1)) {
									vm.hasError = true;
									vm.hasFeedback = true;
									vm.msg = newEditor + 'has to be member first!';								
									
								}
							});							
						} else {

						}

					},function(error){
						vm.hasError = true;
						vm.hasFeedback = true;
						vm.msg = 'fail to query' + newEditor;							
					});
			}

		};

		vm.revokeEditor = function(editor,index) {
			ProjectService.update({id:vm.projectId,$pull:{editors:editor}})
				.$promise
				.then(function(res){
					$log.debug('ProjectDetailsCtrl -> revokeEditor() -> ProjectService.update()');
					$log.debug(res);
					vm.currentProject.editors.splice(index,1);

				},function(error){
					vm.msg = 'some error occured!';
				})
		};

		loadCurrentProject(); 


		function loadCurrentProject() {
		  var projectId = $routeParams.projectId;

		  vm.projectTreeData.projectId = projectId;

		  ProjectService.get({id:projectId})
			.$promise
			.then(function(res){
				$log.debug('ProjectDetailsCtrl -> loadCurrentProject() -> ProjectService.get()');
			  $log.debug(res);
			  vm.currentProject = {
				projectId:projectId,
				projectName:res.projectName,
				description: res.description,
				editors:res.editors,
				tasks:res.tasks
			  };
			  vm.orgId = res.parentOrg;

			  if (angular.isArray(vm.currentProject.tasks)){
				angular.forEach(vm.currentProject.tasks, function(t,index){

				  var tempObj = null;
				  loadTask.getTaskObject(t,tempObj)
					.then(function(res){
						$log.debug('ProjectDetailsCtrl -> loadCurrentProject() -> ProjectService.get() -> loadTask.getTaskObject()');
					  $log.debug(res);
					  vm.projectTreeData.subTasks.push(res);

					  // hide loading icon when ajax request is done
					  if (index===(vm.currentProject.tasks.length-1)) {
							vm.loading=false;
					  }
					},function(error){
						$log.debug('ProjectDetailsCtrl -> loadCurrentProject() -> ProjectService.get() -> loadTask.getTaskObject() :: ERROR');
					  $log.debug(error);
					});
				});
			  }
			},function(error){
				$log.debug('ProjectDetailsCtrl -> loadCurrentProject() :: ERROR');
			  $log.debug(error);
			}); 
		}

  }
  
})();


