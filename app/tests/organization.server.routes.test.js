'use strict';

var should = require('should'),
  request = require('supertest'),
  app = require('../../server'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Organization = mongoose.model('Organization'),
  agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, organization, anotherUser;

/**
 * organization routes tests
 */
describe('Organization CRUD tests', function() {
  beforeEach(function(done) {
    // Create user credentials
    credentials = {
      username: 'test@test.com',
      password: 'password'
    };

    // Create a new user
    user = new User({
      displayName: 'Full Name',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    anotherUser = new User({
      displayName: 'another user',
      username: 'anotherUser@test.com',
      password: 'testtest',
      provider: 'local'
    });

    // Save two users to the test db and create new organization
    user.save(function() {
      organization = {
        orgName: 'testOrg1'
      };

      // done();
      anotherUser.save(done());
    });
  });

  it('should be able to save an organizationq if logged in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        // var userId = user.id;

        // Save a new organization
        agent.post('/api/organizations/')
          .send(organization)
          .expect(200)
          .end(function(organSaveErr, organSaveRes) {
            // Handle organization save error
            if (organSaveErr) done(organSaveErr);

            // Get a list of organization
            agent.get('/api/organizations/')
              .end(function(organsGetErr, organsGetRes) {
                // Handle organization save error
                if (organsGetErr) done(organsGetErr);

                // Get organization list
                var organs = organsGetRes.body;

                // Set assertions
                (organs[0].admin[0]).should.equal(credentials.username);
                (organs[0].orgName).should.match('testOrg1');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an organization if not logged in', function(done) {
    agent.post('/api/organizations/')
      .send(organization)
      .expect(401)
      .end(function(organSaveErr, organSaveRes) {
        // Call the assertion callback
        done(organSaveErr);
      });
  });

  it('should not be able to save an organization if no organization name is provided', function(done) {
    // Invalidate title field
    var anotherOrg = new Organization({
      orgName: ''
    });

    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        // var userId = user.id;

        // Save a new organization
        agent.post('/api/organizations/')
          .send(anotherOrg)
          .expect(400)
          .end(function(organSaveErr, organSaveRes) {
            console.log(organSaveRes.body);
            // Set message assertion
            (organSaveRes.body.message).should.match('organization name is required');

            // Handle organization save error
            done(organSaveErr);
          });
      });
  });

  it('should be able to create and update an organization if signed in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        // var userId = user.id;

        // Save a new organization
        agent.post('/api/organizations/')
          .send(organization)
          .expect(200)
          .end(function(organSaveErr, organSaveRes) {
            // Handle organization save error
            if (organSaveErr) done(organSaveErr);

            // Update organization
            organization.orgName = 'MEAN';

            // Update an existing organization
            agent.put('/api/organizations/' + organSaveRes.body._id)
              .send(organization)
              .expect(200)
              .end(function(organUpdateErr, organUpdateRes) {
                // Handle organization update error
                if (organUpdateErr) done(organUpdateErr);

                // Set assertions
                (organUpdateRes.body._id).should.equal(organSaveRes.body._id);
                (organUpdateRes.body.orgName).should.match('MEAN');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of organizations if signed in', function(done) {
    // Create new organization model instance
    organization.admin = ['test@test.com'];
    var newOrg = new Organization(organization);
    // Save the organization
    newOrg.save(function(err, newOrg) {

      //user sign in
      agent.post('/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function(signinErr, signinRes) {
          // Handle signin error
          if (signinErr) done(signinErr);

          // Request organizations
          agent.get('/api/organizations')
            .end(function(req, res) {
              // Set assertion
              res.body.should.be.an.Array.with.lengthOf(1);

              // Call the assertion callback
              done();
            });

        });
    });

  });


  it('should be able to get a single organization if signed in', function(done) {
    // Create new organization model instance
    organization.admin = ['test@test.com'];
    var newOrg = new Organization(organization);

    // Save the organization
    newOrg.save(function() {
      //user sign in
      agent.post('/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function(signinErr, signinRes) {
          // Handle signin error
          if (signinErr) done(signinErr);

          agent.get('/api/organizations/' + newOrg._id)
            .end(function(req, res) {
              // Set assertion
              res.body.should.be.an.Object.with.property('orgName', organization.orgName);

              // Call the assertion callback
              done();
            });
        });
    });
  });

  it('should return proper error for single organization which doesnt exist, if not signed in', function(done) {
    request(app).get('/api/organizations/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.an.Object.with.property('message', 'organization id is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to create and delete an organization if signed in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        // var userId = user.id;

        // Save a new organization
        agent.post('/api/organizations/')
          .send(organization)
          .expect(200)
          .end(function(organSaveErr, organSaveRes) {
            // Handle organization save error
            if (organSaveErr) done(organSaveErr);

            // Delete an existing organization
            agent.delete('/api/organizations/' + organSaveRes.body._id)
              .send(organization)
              .expect(200)
              .end(function(organDeleteErr, organDeleteRes) {
                // Handle organization error error
                if (organDeleteErr) done(organDeleteErr);

                // Set assertions
                (organDeleteRes.body._id).should.equal(organSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an organization if not org admin', function(done) {
    // Set organization admin
    organization.admin = ['somebodyelse'];

    // Create new organization model instance
    var newOrg = new Organization(organization);

    // Save the organization
    newOrg.save(function() {

      agent.post('/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function(signinErr, signinRes) {
          // Handle signin error
          if (signinErr) done(signinErr);


          // Try deleting organization
          agent.delete('/api/organizations/' + newOrg._id)
          .expect(403)
          .end(function(organDeleteErr, organDeleteRes) {
            // Set message assertion
            (organDeleteRes.body.message).should.match('User is not authorized to view or edit');

            // Handle organization error error
            done(organDeleteErr);
          });
        });

    });
  });



  it('should be able to add member to an organization if signedin user is org admin', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Save a new organization
        agent.post('/api/organizations/')
          .send(organization)
          .expect(200)
          .end(function(organSaveErr, organSaveRes) {
            // Handle organization save error
            if (organSaveErr) done(organSaveErr);

            agent.put('/api/organizations/'+organSaveRes.body._id+'/addMember/'+'anotherUser@test.com')
              .end(function(addMemberErr, addMemberRes) {
                // Handle organization save error
                if (addMemberErr) done(addMemberErr);

                // Set assertions
                (addMemberRes.body.organizations[0].orgId).should.equal(organSaveRes.body._id);
                (addMemberRes.body.organizations[0].orgRole).should.match('member');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to remove member to an organization if signedin user is org admin', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Save a new organization
        agent.post('/api/organizations/')
          .send(organization)
          .expect(200)
          .end(function(organSaveErr, organSaveRes) {
            // Handle organization save error
            if (organSaveErr) done(organSaveErr);

            agent.put('/api/organizations/'+organSaveRes.body._id+'/addMember/'+'anotherUser@test.com')
              .end(function(addMemberErr, addMemberRes) {
                // Handle organization save error
                if (addMemberErr) done(addMemberErr);

                agent.put('/api/organizations/'+organSaveRes.body._id+'/removeMember/'+'anotherUser@test.com')
                  .end(function(removeMemberErr, removeMemberRes) {
                    if (removeMemberErr) done(removeMemberErr)
                    // Set assertions
                    removeMemberRes.body.organizations.should.be.an.Array.with.lengthOf(0);

                    // Call the assertion callback
                    done();
                  });
              });
          });
      });
  });

  it('should be able to assign member as org admin if signedin user is org admin', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Save a new organization
        agent.post('/api/organizations/')
          .send(organization)
          .expect(200)
          .end(function(organSaveErr, organSaveRes) {
            // Handle organization save error
            if (organSaveErr) done(organSaveErr);

            agent.put('/api/organizations/'+organSaveRes.body._id+'/addMember/'+'anotherUser@test.com')
              .end(function(addMemberErr, addMemberRes) {
                // Handle organization save error
                if (addMemberErr) done(addMemberErr);

                agent.put('/api/organizations/'+organSaveRes.body._id+'/assignAdmin/'+'anotherUser@test.com')
                  .end(function(assignAdminErr, assignAdminRes) {
                    if (assignAdminErr) done(assignAdminErr)

                    (assignAdminRes.body.organizations[0].orgRole).should.macth('admin');
                    // Call the assertion callback
                    done();
                  });

              });
          });
      });
  });

  it('should be able to revoke admin user for an organization if signedin user is org admin', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Save a new organization
        agent.post('/api/organizations/')
          .send(organization)
          .expect(200)
          .end(function(organSaveErr, organSaveRes) {
            // Handle organization save error
            if (organSaveErr) done(organSaveErr);

            agent.put('/api/organizations/'+organSaveRes.body._id+'/addMember/'+'anotherUser@test.com')
              .end(function(addMemberErr, addMemberRes) {
                // Handle organization save error
                if (addMemberErr) done(addMemberErr);

                agent.put('/api/organizations/'+organSaveRes.body._id+'/assignAdmin/'+'anotherUser@test.com')
                  .end(function(assignAdminErr, assignAdminRes) {
                    if (assignAdminErr) done(assignAdminErr)

                    agent.put('/api/organizations/'+organSaveRes.body._id+'/revokeAdmin/'+'anotherUser@test.com')
                      .end(function(revokeAdminErr, revokeAdminRes) {
                        if (revokeAdminErr) done(revokeAdminErr)

                        // Set assertions
                        (revokeAdminRes.body.organizations[0].orgRole).should.macth('member');

                        // Call the assertion callback
                        done();
                      });

                  });

              });
          });
      });
  });  

  });

  afterEach(function(done) {
    User.remove({}, function(){
      Organization.remove({}, done);
  });
});
