(function() {
  'use strict';

  angular
    .module('projectMateApp')
    // .constant('APIURL',{baseUrl: 'http://localhost:2403'})
    .constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized',
      displaynameUpdated: 'updateDisplayNameSuccess'
    })
    .constant('USER_ROLES', {
      all: '*',
      admin: 'admin',
      editor: 'editor',
      memember: 'memember',
      organizationLevel:['admin','memember'],
      projectLevel:['editor']
  });

})();