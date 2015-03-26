'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organization = mongoose.model('Organization'),
	Project = mongoose.model('Project'),
	Task = mongoose.model('Task');

/**
 * Globals
 */
var user, task, project, organization;

/**
 * Unit tests
 */
describe('Task Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			displayName: 'Full Name',
			username: 'test@test.com',
			password: 'password',
			provider: 'local'
		});

		user.save(function() { 
			organization = new Organization({
				orgName: 'testOrg1',
				admin: 'test@test.com'				
			});

			organization.save(function(err, organ) {
				project = new Project({
					projectName: 'test project 1',
					description: 'test project 1 description',
					parentOrg: organ.id,
					editors: ['test@test.com']
				});
				
				project.save(function(err, pj) {
					task = new Task({
						taskName: 'test task 1',
						parentProject: pj.id,
						description: 'test task 1 description'
					});

					done();
					
				});
			});			
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return task.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without name', function(done) {
			task.taskName = '';

			return task.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Task.remove().exec(function() {
			Project.remove().exec(function() {
				Organization.remove().exec(function() {
					User.remove().exec(done);
					
				})
			})
		});
	});
});