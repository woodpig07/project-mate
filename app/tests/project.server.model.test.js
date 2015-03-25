'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organization = mongoose.model('Organization'),
	Project = mongoose.model('Project');

/**
 * Globals
 */
var user, project;

/**
 * Unit tests
 */
describe('Project Model Unit Tests:', function() {
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
					description: 'test project description',
					parentOrg: organ.id,
					editors: ['test@test.com']
				});
				
				done();
			});

		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return project.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without name', function(done) {
			project.projectName = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Project.remove().exec(function() {
			Organization.remove().exec(function() {
				User.remove().exec(done);				
			});			
		});
	});
});