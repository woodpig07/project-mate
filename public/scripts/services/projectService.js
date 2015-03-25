(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('ProjectService', ProjectService);

  ProjectService.$inject = ['$resource', '$http'];

  function ProjectService($resource, $http){
    var project = $resource('/api/projects/:id',
                            {id:'@id'},
                            {update: {method: 'PUT'}});

    project.addProject = function(newProject, orgId){
      return $http.post('/api/organizations/' + orgId + '/addProject', newProject);
    }

    return project;
  }
})();