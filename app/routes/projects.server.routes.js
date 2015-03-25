'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  projects = require('../../app/controllers/projects.server.controller'),
  organizations = require('../../app/controllers/organizations.server.controller');

module.exports = function(app) {
  // project Routes
  app.route('/api/projects')
    .get(projects.list);
    // .get(users.hasAuthorization('admin'), projects.list);
    // .post(users.requiresLogin, projects.hasAuthorization, projects.create);

  app.route('/api/organizations/:organizationId/addProject')
    .post(users.requiresLogin, organizations.hasAuthorization, projects.create);

  app.route('/api/projects/:projectId')
    .get(projects.read)
    // .put(users.requiresLogin, projects.update)
    .put(users.requiresLogin, projects.hasAuthorization, projects.update)
    .delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

  // Finish by binding the article middleware
  app.param('projectId', projects.projectByID);
  app.param('organizationId', organizations.organizationByID);
};