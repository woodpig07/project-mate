(function() {
  'use strict';
  angular
    .module('projectMateApp')
    .config(routeConfig)
    .config(httpConfig)
    .config(debugConfig)
    .config(notifyConfig)
    .run(run);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'LoginCtrl',
        access: {loginRequired:false}
      })
      .when('/logout', {
        template: '',
        controller: 'LogoutCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'RegisterCtrl'        
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'HomeCtrl',
        access: {loginRequired:true}
      })
      .when('/home/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'ProfileCtrl',
        access: {loginRequired:true}
      })
      .when('/home/organization', {
        templateUrl: 'views/organization.html',
        controller: 'OrganizationCtrl',
        controllerAs: 'OrganizationCtrl',
        access: {loginRequired:true}
      })
      .when('/home/project', {
        templateUrl: 'views/project.html',
        access: {loginRequired:true}
      })
      .when('/home/project/:projectId', {
        templateUrl: 'views/project-details.html',
        controller: 'ProjectDetailsCtrl',
        controllerAs: 'ProjectDetailsCtrl',
        access: {loginRequired:true}
      })
      .otherwise({
        redirectTo: '/'
      });
  }

  function httpConfig($httpProvider){
    $httpProvider.interceptors.push('errorHttpInterceptor');
    $httpProvider.defaults.withCredentials = true;    
  }

  function debugConfig($logProvider) {
    $logProvider.debugEnabled(false);
  }

  function notifyConfig(notificationsConfigProvider) {
    notificationsConfigProvider.setAutoHide(true);
    notificationsConfigProvider.setHideDelay(3000);
  }

  function run($rootScope, $location, $timeout, AuthService, notifications){
    $rootScope.$on('$routeChangeStart',function(event, next){

      if(next.access && next.access.loginRequired && !AuthService.isAuthenticated()){
        notifications.showError({message: 'Please sign in to view ' + $location.absUrl()});
        event.preventDefault();

        $timeout(function() {

          $location.path('/login');
        }, 3000);
      }
    });
  }
})();