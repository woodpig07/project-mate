(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('User', User);

  User.$inject = ['$q','$resource', '$http', 'Session','arrayObjectUtil'];
  function User($q, $resource, $http, Session, arrayObjectUtil) {
    var user = $resource('/users',
                  null,
                  {update: {method: 'PUT'}});

    user.updateDisplayName = function(uid, newName){
      var _this = this;
      return _this.update({id: Session.user._id,displayname: newName}).$promise;
      // return $http.put('/users', {id: uid,displayname: newName});
    };
    user.updatePwd = function(userpwd){ 
      return $http.post('/users/password', userpwd);
    };

    return user;

  }
})();