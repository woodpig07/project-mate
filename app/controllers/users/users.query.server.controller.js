'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * List of Users
 */
exports.list = function(req, res) {
  // User.find().sort('-created').exec(function(err, users) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     _.forEach(users, function(u) {
  //       // Remove sensitive data before login
  //       u.password = undefined;
  //       u.salt = undefined;
  //     });
  //     res.json(users);
  //   }
  // });

  if (req.query) {
    User.find(req.query,'id username organizations', function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    if (!users) {
      return res.status(404).send({
        message: 'No existing account for ' + req.query.username
      });
    }

    res.json(users || null);
    });    
  }
};

// /**
//  * query user by name middleware
//  */
// exports.queryUsername = function(req, res, next) {
//   if (req.query.username) {
//     User.findOne({'username':req.query.username},'id username organizations', function(err, user) {
//       if (err) return next(err);
//       if (!user) return next(new Error('No existing account for ' + req.query.username));
//       req.queryResult = user;
//     });    
//   }
//   next();
// };

// /**
//  * return query result
//  */
// exports.query = function(req, res) {
//   res.json(req.queryResult || null);
// };