'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Task = mongoose.model('Task'),
    Project = mongoose.model('Project'),
    async = require('async'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

/**
 * Create a Task
 */
exports.create = function(req, res) {
  var newTask = new Task(req.body);
  // var cb = function(err, task) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(task);
  //   }
  // };
  if (_.isEmpty(newTask.parentTask)) {
    newTask.save(function(err, task) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        Project.findByIdAndUpdate(newTask.parentProject, {$push:{tasks: task.id}}, function(err, project){
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else if (!project) {
            return res.status(404).send({
              message: 'no such project' + newTask.parentProject
            });
          } else {
            console.log(project);

            res.json(task);
          }
        });

      }
    });

  } else {
    newTask.save(function(err, task) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        Task.findByIdAndUpdate(newTask.parentTask, {$push:{subTasks: task.id}},function(err, ptask){
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else if (!ptask) {
            return res.status(404).send({
              message: 'no such parent Task' + newTask.parentTask
            });
          } else {
            console.log(ptask);
            res.json(task);
          }
        });
      }
    });
  }
};

/**
 * Show the current Task
 */
exports.read = function(req, res) {
  res.json(req.task);
};

/**
 * Update a Task
 */
exports.update = function(req, res) {
  var task = req.task;

  task = _.extend(task, req.body);

  task.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
  var task = req.task;

  // task.remove(function(err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(task);
  //   }
  // });

  var cb = function(err, task) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  };

  if (_.isEmpty(task.parentTask)) {
    Project.findByIdAndUpdate(task.parentProject, {$pull: {tasks: task.id}},function(err, project){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!project) {
        return res.status(404).send({
          message: 'no such project' + task.parentProject
        });
      } else {
        console.log(project);
        task.remove(cb);
      }
    });

  } else {
    Task.findByIdAndUpdate(newtask.parentTask, {$pull: {subTasks: task.id}},function(err, pTask){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!pTask) {
        return res.status(404).send({
          message: 'no such parent Task' + task.parentTask
        });
      } else {
        console.log(pTask);
        task.remove(cb);
      }
    });
  }  
};

/**
 * List of Tasks
 */
exports.list = function(req, res) {
  var query = _.isEmpty(req.query) ? Task.find() : Task.find(req.query);
  query.sort('-created').exec(function(err, tasks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tasks || tasks);
    }
  });
};

/**
 * Project search by id middleware
 */
exports.taskByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'task id is invalid'
    });
  }

  Task.findById(id).exec(function(err, task) {
    if (err) return next(err);
    if (!task) {
      return res.status(404).send({
          message: 'project not found'
        });
    }
    req.task = task;
    next();
  });
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  var pid = req.task ? req.task.parentProject : req.body.parentProject;

  Project.findById(pid).select('editors').exec(function(err, project) {
    if (err) return next(err);
    if (!project) {
      return res.status(404).send({
          message: 'prarent project not found'
        });
    } else if (_.indexOf(project.editors, req.user.username) < 0) {
      return res.status(403).send({
        message: 'User is not authorized to edit'
      });
    }
    next();
  }); 

};
