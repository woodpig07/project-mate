(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('ModalCtrl', ModalCtrl);

  ModalCtrl.$inject = ['$modal','$log','$controller','$scope'];
  function ModalCtrl($modal,$log,$controller,$scope) {
    var vm = this;
    var addModalUrl = '../../views/projectTree/addModalContent.html';
    var editModalUrl = '../../views/projectTree/editModalContent.html';  
    var projectOperationCtrl = $controller('ProjectOperationCtrl'); 

    vm.remove = projectOperationCtrl.remove;
    vm.open = function(item,size){
      createAddModalInstance(addModalUrl,item,size);
    };

    vm.edit = function(item,size){
      createEditModalInstance(editModalUrl,item,size);  
    };

    function createAddModalInstance(templUrl,item,size){

      var modalInstance = $modal.open({
        templateUrl: templUrl,
        controller: 'ModalInstanceCtrl',
        controllerAs : 'ModalInstanceCtrl',
        size:size,
        resolve:{
          item: function() {   //item will be injested to ModalInstanceCtrl
            return item;
          }
        }
      });

      modalInstance.result.then(function(newNode){
        projectOperationCtrl.add(item,newNode);
      }, function(){
        $log.info('add modal dismissed at:' + new Date());
      });
    }

    function createEditModalInstance(templUrl,item,size){

      var modalInstance = $modal.open({
        templateUrl: templUrl,
        controller: 'ModalInstanceCtrl',
        controllerAs : 'ModalInstanceCtrl',
        size:size,
        resolve:{
          item: function() {   //item will be injested to ModalInstanceCtrl
            return item;
          }
        }
      });

      modalInstance.result.then(function(updatedNode){
        projectOperationCtrl.update(item,updatedNode);
      }, function(){
        $log.info('add modal dismissed at:' + new Date());
      });
    }
  }

})();


