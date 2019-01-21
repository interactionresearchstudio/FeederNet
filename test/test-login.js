process.env.NODE_ENV = 'test';

// Load modules required for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Load app and schemas
const server = require('../server/app');
const User = require('../server/models/user');

// Setup chai
var should = chai.should();
chai.use(chaiHttp);

describe('Route - Login', () => {

  before((done) => {
    var adminUser = new User();
    adminUser.local.username = "admin-test";
    adminUser.local.password = adminUser.generateHash(process.env.ADMIN_PASSWORD || "admin-test-pass");
    adminUser.save((err) => {
      done();
    });
  });

  after((done) => {
    try {
      User.collection.drop();
    } catch (e) {
      if (e.code === 26) {
        console.log('namespace %s not found', User.collection.name);
      } else {
        throw e;
      }
    }
    done();
  });

  it('should return 200 with session cookie if a user logs in with /api/login POST', (done) => {
    chai.request(server)
    .post('/api/login')
    .send({'username': 'admin-test', 'password': 'admin-test-pass'})
    .end((err, res) => {
      res.should.have.status(200);
      res.should.have.cookie('connect.sid');
      done();
    });
  });

  it('should return 401 if password is invalid with /api/login POST', (done) => {
    chai.request(server)
    .post('/api/login')
    .send({'username': 'admin-test', 'password': 'admin-wrong-pass'})
    .end((err, res) => {
      res.should.have.status(401);
      done();
    });
  });

  it('should return 401 if user is not found with /api/login POST', (done) => {
    chai.request(server)
    .post('/api/login')
    .send({'username': 'admin-wrong', 'password': 'admin-pass'})
    .end((err, res) => {
      res.should.have.status(401);
      done();
    });
  });
});
