'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  tasks = require('../../app/controllers/tasks.server.controller');

module.exports = function(app) {
  // task Routes
  app.route('/api/tasks')
    .get(users.hasAuthorization('admin'), tasks.list)
    .post(users.requiresLogin, tasks.hasAuthorization, tasks.create);

  app.route('/api/tasks/:taskId')
    .get(tasks.read)
    .put(users.requiresLogin, tasks.hasAuthorization, tasks.update)
    .delete(users.requiresLogin, tasks.hasAuthorization, tasks.delete);

  // Finish by binding the article middleware
  app.param('taskId', tasks.taskByID);
};