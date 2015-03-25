(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .factory('arrayObjectUtil', arrayObjectUtil);

  arrayObjectUtil.$inject = ['$log'];

  function arrayObjectUtil($log) {
    return {
      rmObjFromArray:rmObjFromArray
    };

    function rmObjFromArray(obj,objArray){
      for (var i = objArray.length-1;i>=0;i--){
        for (var key in obj) {
          if (obj.hasOwnProperty(key)){
            var objToCk = objArray[i];
            if (objToCk[key] && objToCk[key]===obj[key]) {
              objArray.splice(i,1);

              if (i===0){
                $log.debug('arrayObjectUtil -> rmObjFromArray()');
                $log.debug(objArray);
                return objArray;
              }       
            }
          }
        }
      }
    }

  }
})();