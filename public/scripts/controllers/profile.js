(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('ProfileCtrl',ProfileCtrl);

  ProfileCtrl.$inject = ['$rootScope','Session','User','$log','AUTH_EVENTS'];

  function ProfileCtrl($rootScope,Session,User,$log,AUTH_EVENTS) {
    var vm = this;
    vm.currentUser = Session.user;
    vm.updatePwdRes = {update_success:false,
                        update_error:false};

    vm.resetForm = function(form){
      var de = {};
      if(form) {
        form.$setPristine();
        form.$setUntouched();
      }
      vm.userpwd = angular.copy(de);
    }
    vm.updateDisplayName = function(){

      return function(newName) {
          User.updateDisplayName(Session.user._id, newName).then(function(res){
            $log.debug('ProfileCtrl -> updateDisplayName()');
            $log.debug(res);
            Session.user.displayname = res.displayname;
            vm.currentUser.displayname = res.displayname;
            $rootScope.$broadcast(AUTH_EVENTS.displaynameUpdated);
            
          }, function(error){
            $log.debug('ProfileCtrl -> updateDisplayName() :: ERROR');
            $log.debug(error);
          });
      };

    };


    vm.updatePwd = function(userpwd, form){
        //update pwd
        User.updatePwd(userpwd).then(function(res){
          vm.updatePwdRes.update_error=false;
          vm.updatePwdRes.update_success=true;

        }, function(error){
          $log.debug('ProfileCtrl -> updatePwd()::ERROR');
          $log.debug(error);
          vm.updatePwdRes.update_success=false;
          vm.updatePwdRes.update_error=true;
          vm.updatePwdRes.error = error.data.message;
          
        });

        vm.resetForm(form);  
    };
  }

})();

