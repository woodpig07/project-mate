'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    organizations = require('../../app/controllers/organizations.server.controller');

module.exports = function(app) {
  // organization Routes
  app.route('/api/organizations/')
    // .get(users.hasAuthorization('admin'), organizations.list)
    .get(users.requiresLogin, organizations.list)
    .post(users.requiresLogin, organizations.create);

  app.route('/api/organizations/:organizationId')
    .get(users.requiresLogin, organizations.read)
    .put(users.requiresLogin, organizations.hasAuthorization, organizations.update)
    .delete(users.requiresLogin, organizations.hasAuthorization, organizations.delete);

  app.route('/api/organizations/:organizationId/projects/')
    .get(organizations.read);

  app.route('/api/organizations/:organizationId/addMember/:username')
    .put(users.requiresLogin, organizations.hasAuthorization, organizations.addMember);
    
  app.route('/api/organizations/:organizationId/removeMember/:username')
    .put(users.requiresLogin, organizations.hasAuthorization, organizations.removeMember);

  app.route('/api/organizations/:organizationId/assignAdmin/:username')
    .put(users.requiresLogin, organizations.hasAuthorization, organizations.assignAdmin);
    
  app.route('/api/organizations/:organizationId/revokeAdmin/:username')
    .put(users.requiresLogin, organizations.hasAuthorization, organizations.revokeAdmin);

  // Finish by binding the article middleware
  app.param('organizationId', organizations.organizationByID);
  app.param('username', users.userByUsername);
};