(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('OrganizationCtrl',OrganizationCtrl); 

  OrganizationCtrl.$inject = ['$q','$http','$modal','$log','Organizations','User','Session'];

  function OrganizationCtrl($q,$http,$modal,$log,Organizations,User,Session) {
    var vm = this;

    vm.organizations = Session.user.organizations;
    var removeMemberModalUrl = '../../views/removeMemberModal.html';
    
    vm.addMember = function(organ){
      var username = organ.newMember
      organ.updating = true;

      Organizations.addMember(organ.orgId, username)
          .then(function(res){
            $log.debug('OrganizationCtrl -> addMember() -> Organizations.addMember()');
            $log.debug(res.data);
            organ.newMember = "";
            organ.addResults = username + 'is added!';
            if (organ.members) {
              organ.members.push({username:username, role:'member'});
            }
          },function(reason){
            organ.addResults = reason.data.message;
          })
          .finally(function() {
            organ.updating = false;
          });          
    };

    vm.removeMember = function(organ, username, idx){

      Organizations.removeMember(organ.orgId, username)
          .then(function(res){
            $log.debug('OrganizationCtrl -> removeMember() -> Organizations.removeMember()');
            $log.debug(res.data);
            organ.memberTableMsg = username + ' is removed!';
            organ.members.splice(idx, 1);            
          },function(reason){

          organ.memberTableMsg = reason.data.message;
          });
    };

    vm.assignAdmin = function(organ, username, idx){

      Organizations.assignAdmin(organ.orgId, username)
          .then(function(res){
            $log.debug('OrganizationCtrl -> assignAdmin() -> Organizations.assignAdmin()');
            $log.debug(res.data);
            // vm.organizations[idx].memberTableMsg = username + 'is now admin!';
            // vm.organizations[idx].members[idx].role= 'admin';
            organ.memberTableMsg = username + ' is now admin!';
            organ.members[idx].role = 'admin';
          },function(reason){
          // vm.organizations[idx].memberTableMsg = reason.data.message;
          organ.memberTableMsg = reason.data.message;
          });
    };

    vm.revokeAdmin = function(organ, username, idx){

      Organizations.revokeAdmin(organ.orgId, username)
          .then(function(res){
            $log.debug('OrganizationCtrl -> revokeAdmin() -> Organizations.removeAdmin()');
            $log.debug(res.data);
            // vm.organizations[idx].memberTableMsg = username + 'is now not admin';
            // vm.organizations[idx].members[idx].role = 'member';
            organ.memberTableMsg = username + ' is now not admin!';
            organ.members[idx].role = 'member';            
          },function(reason){
          // vm.organizations[idx].memberTableMsg = reason.data.message;
          organ.memberTableMsg = reason.data.message;
          });
    };

    vm.getOrgMembers = function(orgId, idx){
      Organizations.get({id:orgId}).$promise.then(function(data){
        if (!angular.isArray(data.admin)||!angular.isArray(data.members)) {
          return;
        }
        var admins = data.admin.map(function(u){
          return {username:u, role:'admin'};
        });
        var mems = data.members.map(function(u){
          return {username:u, role:'member'};
        });

        vm.organizations[idx].members = admins.concat(mems);

      });

    };

    vm.openRemoveMemberModal = function(organ, username, idx){
      var item = {
        vm:vm,
        organ:organ,
        username:username,
        idx:idx
      };
      $log.debug('remove member button clicked!!!');
      createAddModalInstance(removeMemberModalUrl,item);
    };    

    function createAddModalInstance(templUrl,item){

      var modalInstance = $modal.open({
        templateUrl: templUrl,
        controller: 'RemoveMemberModalInstanceCtrl',
        controllerAs : 'RemoveMemberModalInstanceCtrl',
        size:'small',
        resolve:{
          item: function() {   //item will be injested to RemoveMemberModalInstanceCtrl
            return item;
          }
        }
      });

      modalInstance.result.then(function(item){
        vm.removeMember(item.organ, item.username, item.idx);
      }, function(){
        $log.info('add modal dismissed at:' + new Date());
      });
    }

  }


})();
