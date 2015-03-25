'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Organization = mongoose.model('Organization'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

/**
 * Create a Project
 */
exports.create = function(req, res) {
  var organization = req.organization;
  var project = new Project(req.body);
  project.editors.concat(organization.admin);
  project.parentOrg = organization.id;
  
  project.save(function(err, project) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //updating ref
      organization.projects.push(project);

      organization.save(function(err, organ){
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(project);
        }
      });
    }
  });
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
  res.json(req.project);
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
  var obj = req.body;
  var command = {};
  var project = req.project;

  //filtering out the atomic operation
  _.forOwn(obj, function(value, key) {
    if (key.indexOf('$') === 0) {
      command[key] = value;
    }
  });

  if (_.isEmpty(command)) {

    project = _.extend(project, req.body);

    project.save(function(err, project) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(project);
      }
    });
  } else {
    Project.findByIdAndUpdate(project.id, command, function(err, p){
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {

            res.json(p);
          }
    });
  }
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
  var project = req.project;


  project.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
    Organization.findById(project.parentTask, function(err, organ){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!organ) {
        return res.status(404).send({
          message: 'no such parent Task' + project.parentOrg
        });
      } else {
        _.without(organ.projects, project);
        // TODO: remove all tasks
        res.json(project);
      }
    });

    }
  });
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
  var query = _.isEmpty(req.query) ? Project.find() : Project.find(req.query);
  query.sort('-created').select('id projectName description').exec(function(err, projects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(projects || null);
    }
  });
};

/**
 * Project search by id middleware
 */
exports.projectByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'project id is invalid'
    });
  }

  Project.findById(id).exec(function(err, project) {
    if (err) return next(err);
    if (!project) {
      return res.status(404).send({
          message: 'project not found'
        });
    }
    req.project = project;
    next();
  });
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  // Organization.findById(req.project.parentOrg).select('admin').exec(function(err, organ) {
  //   if (err) return next(err);
  //   if (!organ) {
  //     return res.status(404).send({
  //       message: 'no such Organization'
  //     });
  //   }

  // });
  if (_.indexOf(req.project.editors, req.user.username) < 0) {
    return res.status(403).send({
      message: 'User is not authorized to view or edit'
    });
  }
  next();
};
