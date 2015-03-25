(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('Organizations', Organizations);

  Organizations.$inject = ['$resource', '$q', '$http'];
  function Organizations($resource, $q, $http) {
    var organizations = $resource('/api/organizations/:id',
                            {id: '@id'},
                            {update: {method: 'PUT'}});

    organizations.addOrg = function(newOrg) {
      return this.save(newOrg).$promise;
    };

    organizations.addMember = function(orgId, username) {
      return $http.put('/api/organizations/' + orgId + '/addMember/' + username , {organizationId:orgId, username:username});
    };

    organizations.removeMember = function(orgId, username) {
      return $http.put('/api/organizations/' + orgId + '/removeMember/' + username , {organizationId:orgId, username:username});
    };

    organizations.assignAdmin = function(orgId, username) {
      return $http.put('/api/organizations/' + orgId + '/assignAdmin/' + username , {organizationId:orgId, username:username});
    };

    organizations.revokeAdmin = function(orgId, username) {
      return $http.put('/api/organizations/' + orgId + '/revokeAdmin/' + username , {organizationId:orgId, username:username});
    };

    return organizations;
  }
})();