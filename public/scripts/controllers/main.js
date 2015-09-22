(function() {
  'use strict';

  angular
    .module('projectMateApp')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$location', 'Session','ErrorService','AUTH_EVENTS', '$log'];

  function MainCtrl($scope,$location,Session,ErrorService,AUTH_EVENTS,$log) {
    var vm = this;
    vm.errorService = ErrorService;
    vm.currentUser = Session.user;
    vm.navOpen = false;
    vm.currentRoute = $location.path();

    $scope.$on(AUTH_EVENTS.loginSuccess, function() {
      vm.currentUser = Session.user;
    });
    $scope.$on(AUTH_EVENTS.displaynameUpdated, function(){
      $log.info(AUTH_EVENTS.displaynameUpdated);

      vm.currentUser.displayname = Session.user.displayname;

    });
    $scope.$on(AUTH_EVENTS.logoutSuccess, function(){
      vm.currentUser = null;
      vm.currentUsername = null;
    });
    $scope.$on('$routeChangeStart', function(event, next, current) {
      vm.navOpen = false;
    });
    $scope.$on('$routeChangeSuccess', function(event, current, prev) {
      vm.currentRoute = current.$$route.originalPath;
    });

  }
})();

