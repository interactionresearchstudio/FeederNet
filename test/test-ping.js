process.env.NODE_ENV = 'test';

// Load modules required for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Load app and schemas
const server = require('../server/app');
const Feeder = require('../server/models/feeder');
const Event = require('../server/models/event');

// Setup chai
var should = chai.should();
chai.use(chaiHttp);

describe('Route - Ping', () => {
  before((done) => {
    // Create new feeder
    var newFeeder = new Feeder({
      stub: 'ping-test-feeder-stub',
      name: 'ping-test-feeder-name',
      location: {
        latitude: '1.0000',
        longitude: '1.0000'
      },
      lastPing: 'never'
    });

    // Save data
    newFeeder.save((err, feeder_data) => {
      done();
    });
  });

  after((done) => {
    for (let model of [Feeder, Event]) {
      try {
        model.collection.drop();
      } catch (e) {
        if (e.code === 26) {
          console.log('namespace %s not found', model.collection.name);
        } else {
          throw e;
        }
      }
    }
    done();
  });

  it('should update lastPing of feeder and create new event on /ping POST', (done) => {
    chai.request(server)
    .post('/api/ping')
    .send({
      'stub': 'ping-test-feeder-stub'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('UPDATED');
      res.body.UPDATED.should.be.a('object');
      res.body.UPDATED.should.have.property('_id');
      res.body.UPDATED.should.have.property('stub');
      res.body.UPDATED.should.have.property('name');
      res.body.UPDATED.should.have.property('location');
      res.body.UPDATED.should.have.property('lastPing');
      res.body.UPDATED.stub.should.equal('ping-test-feeder-stub');
      res.body.UPDATED.name.should.equal('ping-test-feeder-name');
      res.body.UPDATED.location.should.be.a('object');
      res.body.UPDATED.location.should.have.property('latitude');
      res.body.UPDATED.location.should.have.property('longitude');
      res.body.UPDATED.location.latitude.should.equal('1.0000');
      res.body.UPDATED.location.longitude.should.equal('1.0000');
      res.body.UPDATED.lastPing.should.not.equal('never');;
      chai.request(server)
      .get('/api/events')
      .end((_err, _res) => {
        _res.should.have.status(200);
        _res.should.be.json;
        _res.body.should.be.a('array');
        _res.body[0].should.have.property('_id');
        _res.body[0].should.have.property('type');
        _res.body[0].should.have.property('ip');
        _res.body[0].should.have.property('datetime');
        _res.body[0].should.have.property('feeder');
        _res.body[0].type.should.equal('ping');
        _res.body[0].feeder.should.have.property('stub');
        _res.body[0].feeder.should.have.property('name');
        _res.body[0].feeder.should.have.property('location');
        _res.body[0].feeder.should.have.property('lastPing');
        _res.body[0].feeder.stub.should.equal('ping-test-feeder-stub');
        _res.body[0].feeder.name.should.equal('ping-test-feeder-name');
        done();
      });
    });
  });
});
