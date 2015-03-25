'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Organization = mongoose.model('Organization'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * Create a Organization
 */
exports.create = function(req, res) {
  var organ = new Organization(req.body);
  var user = req.user;

  organ.admin.push(req.user.username);

  organ.save(function(err, organ) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //update ref
      var userOrg = {orgId:organ.id, orgName:organ.orgName, orgRole:"admin"};
      user.organizations.push(userOrg);
      user.save(function(err, user){
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(organ);
        }
      });
      
    }
  });
};

/**
 * Show the current Organization
 */
exports.read = function(req, res) {
  res.json(req.organization);
};

/**
 * Update a Organization
 */
exports.update = function(req, res) {

  var organ = req.organization;

  organ = _.extend(organ, req.body);

  organ.save(function(err, organ) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(organ);
    }
  });
};

/**
 * Delete an Organization
 */
exports.delete = function(req, res) {
  var organ = req.organization;

  organ.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(organ);
    }
  });
};

/**
 * List of Organizations
 */
exports.list = function(req, res) {

  var query = _.isEmpty(req.query) ? Organization.find() : Organization.find(req.query);

    query.sort('-created').select('orgName admin').exec(function(err, organs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(organs||null);
      }
    });
};

/**
 * assign user to Organizations member
 */
exports.addMember = function(req, res) {
  var newMember = req.queryResult;
  var organ = req.organization;
  console.log(_.indexOf(organ.members, newMember.username));

  if (_.indexOf(organ.members, newMember.username)>=0) {
    return res.status(400).send({
      message: req.queryResult.username + 'are already member'
    });
  } else {
    organ.members.push(req.queryResult.username);
    organ.save(function(err, organ) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        newMember.organizations.push({orgId:organ.id, orgName:organ.orgName, orgRole:'member'});
        newMember.save(function(err, user) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });              
          } else {
            res.json(user);
          }
        });
      }
    });
  }

};

/**
 * assign user to Organizations admin, then grant user editor rights at project level
 */
exports.assignAdmin = function(req, res) {
  var newAdmin = req.queryResult;
  var organ = req.organization;
  var oid = _.findIndex(newAdmin.organizations, function(m) {
    return m.orgId == organ._id;
  });
  console.log('oid: '+oid);

  if (_.indexOf(organ.admin, newAdmin.username)>=0) {
    return res.status(400).send({
      message: newAdmin.username + 'are already admin'
    }); 
  } else if (_.indexOf(organ.members, newAdmin.username)<0) {
    return res.status(400).send({
      message: newAdmin.username + 'are not organization member'
    });     
  }
  organ.members.pull(newAdmin.username);
  organ.admin.push(newAdmin.username);
  organ.save(function(err, o){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      async.each(organ.projects, function(project,callback) {
        
        Project.findByIdAndUpdate(project._id, {$push: {editors:newAdmin.username}}, function(err, p){
          callback(err);
          // if (err) {
          //   return res.status(400).send({
          //     message: errorHandler.getErrorMessage(err)
          //   });
          // } else if (!p) {
          //   return res.status(400).send({
          //     message: 'no such organization:' + req.organization.id
          //   });
          // }
        });
      }, function(err){
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          newAdmin.organizations[oid].orgRole = "admin";
          newAdmin.save(function(err, user) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });              
            } else {
              res.json(o);
            }
          });
        }
      });
    }
  });

  
};

/**
 * revoke Organizations admin right, user editor rights at project-leve will be revoked too
 */
exports.revokeAdmin = function(req, res) {
  var oldAdmin = req.queryResult;
  var organ = req.organization;
  var oid = _.findIndex(oldAdmin.organizations, function(m) {
    return m.orgId == organ._id;
  });
  console.log('oid: '+oid);

  if (_.indexOf(organ.admin, oldAdmin.username)<0) {
    return res.status(400).send({
      message: oldAdmin.username + 'is not admin'
    });      
  } else {
    organ.admin.pull(oldAdmin.username);
    organ.members.push(oldAdmin.username);
    organ.save(function(err, o){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        async.each(organ.projects, function(project,callback) {
          
          Project.findByIdAndUpdate(project._id, {$pull: {editors:oldAdmin.username}}, function(err, p){
            callback(err);
            // if (err) {
            //   return res.status(400).send({
            //     message: errorHandler.getErrorMessage(err)
            //   });
            // } else if (!p) {
            //   return res.status(400).send({
            //     message: 'no such organization:' + req.organization.id
            //   });
            // }
          });

        }, function(err){
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            oldAdmin.organizations[oid].orgRole = "member";

            oldAdmin.save(function(err, user) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });              
              } else {
                res.json(o);
              }
            });
          }
        });
      }
    });

  }
};

/**
 * remove Organizations member, if user had admin rights, revoke admin first
 */
exports.removeMember = function(req, res) {
  var member = req.queryResult;
  var organ = req.organization;
  var oid;
  var isAdmin = _.indexOf(req.organization.admin, req.queryResult.username) >= 0;

  organ.admin.pull(member.username);
  organ.members.pull(member.username);
  oid = _.result(_.find(member.organizations, function(m) {
    return m.orgId == organ._id;
  }), '_id');

  console.log(oid);

  organ.save(function(err, organ) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
        async.each(organ.projects, function(project,callback) {
          if (!isAdmin) {
            callback();
          } else {
            Project.findByIdAndUpdate(project._id, {$pull: {editors:member.username}}, function(err, p){
              callback(err);
            });            
          }

        }, function(err){
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            member.organizations.id(oid).remove();
            console.log(member.organizations);
            console.log(organ);
            member.save(function(err, user) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });              
              } else {
                console.log(user);
                res.json(user);
              }
            });
          }
        });
      }
    });
  
};

/**
 * Organization search by id middleware
 */
exports.organizationByID = function(req, res, next, id) {
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'organization id is invalid'
    });
  }

  Organization.findById(id).populate('projects').exec(function(err, organ) {
    if (err) return next(err);
    if (!organ) {
      return res.status(404).send({
          message: 'organization not found'
        });
    }
    req.organization = organ;
    next();
  });
};

/**
 * Organization authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  console.log(req.organization.admin,req.user.username);
  console.log()
  if (_.indexOf(req.organization.admin, req.user.username) < 0) {
    return res.status(403).send({
      message: 'User is not authorized to view or edit'
    });
  }
  next();
};
