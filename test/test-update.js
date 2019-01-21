process.env.NODE_ENV = 'test';

// Load modules required for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Load app and schemas
const server = require('../server/app');

// Setup chai
var should = chai.should();
chai.use(chaiHttp);

describe('Route - Update', () => {
  it('should return the latest binary from GitHub', (done) => {
    chai.request(server)
    .get('/api/update')
    .set('x-ESP8266-version', 'v0.9')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.have.header('content-type', 'application/octet-stream');
      console.log(res.body);
      done();
    });
  });
  it('should return a 304 when no update is required', (done) => {
    chai.request('https://api.github.com')
    .get('/repos/interactionresearchstudio/RFIDBirdFeeder/releases/latest')
    .end((err, res) => {
      chai.request(server)
      .get('/api/update')
      .set('x-ESP8266-version', res.body.tag_name)
      .end((_err, _res) => {
        _res.should.have.status(304);
        done();
      });
    });
  });
});
