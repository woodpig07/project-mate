(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('ModalInstanceCtrl',ModalInstanceCtrl);

  ModalInstanceCtrl.$inject = ['$modalInstance','$filter','item','$log'];

  function ModalInstanceCtrl($modalInstance,$filter,item, $log) {
    var vm = this;
    $log.debug('ModalInstanceCtrl -> item:');
    $log.debug(item);
    vm.item=item;
    
    vm.add = function(){
      $modalInstance.close(vm.newNode);
    };
    vm.cancel = function(){
      $modalInstance.dismiss('cancel');
    };
    vm.save = function(){
      $modalInstance.close(vm.updatedItem);
    };
    vm.today = function(){
      vm.startDate = new Date();
    };
    vm.today();    

    vm.openDatePicker = function($event){
      $event.preventDefault();
      $event.stopPropagation();

      vm.opened = true;
    };
    
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    vm.enddt = function(startDate,duration){
      if(startDate && angular.isDate(startDate)) {
        var newDate = new Date();
        newDate.setDate(startDate.getDate()+duration);
        return $filter('date')(newDate, 'yyyy-MM-dd');
        
      } else if (startDate && !angular.isDate(startDate)) {
        var newDate = new Date();
        startDate = new Date(startDate);
        newDate.setDate(startDate.getDate()+duration);
        return $filter('date')(newDate, 'yyyy-MM-dd');
      } else {
        return '';
      }
    };    
  }

})();

