'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Projects Schema
 */
var ProjectSchema = new Schema({
  projectName: {
    type: String,
    trim: true,
    required: 'project name is required'
  },
  editors:{
    type: [String]
  },
  description:{
    type: String
  },
  parentOrg:{
    type: String
  },
  tasks:[String],
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Project', ProjectSchema);