'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tasks Schema
 */
var TaskSchema = new Schema({
  taskName: {
    type: String,
    trim: true,
    required: 'project name is required'
  },
  startDate:{
    type: Date,
    default: Date.now
  },
  duration:{
    type: Number
  },
  description:{
    type: String
  },
  parentProject:{
    type: String
  },
  parentTask:{
    type: String
  },
  subTasks:{
    type:[String]
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Task', TaskSchema);