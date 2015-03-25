'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organization = mongoose.model('Organization');

/**
 * Globals
 */
var user, organization;

/**
 * Unit tests
 */
describe('Organization Model Unit Tests:', function() {
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
				admin: ['test@test.com']				
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return organization.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without name', function(done) {
			organization.orgName = '';

			return organization.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without admin', function(done) {
			organization.admin = [];

			return organization.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Organization.remove().exec(function() {
			User.remove().exec(done);			
		});
	});
});