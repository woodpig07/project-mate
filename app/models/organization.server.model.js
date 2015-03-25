'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Organizations Schema
 */
// var childProjectSchema = new Schema({
//   projectId:{
//     type: String
//   },
//   projectName:{
//     type: String
//   }
// });

var OrganizationSchema = new Schema({
  orgName: {
    type: String,
    trim: true,
    required: 'organization name is required',
    unique: 'Username already exists',
  },
  description: {
    type: String
  },
  admin:{
    type: [String],
    required: 'organization admin is required'

  },
  members:{
    type: [String]
  },
  projects:[{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});


mongoose.model('Organization', OrganizationSchema);