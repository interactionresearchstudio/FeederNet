process.env.NODE_ENV = 'test';

// Load modules required for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Load app and schemas
const server = require('../server/app');
const Bird = require('../server/models/bird');
const Feeder = require('../server/models/feeder');
const Waypoint = require('../server/models/waypoint');
const Event = require('../server/models/event');

// Setup chai
var should = chai.should();
chai.use(chaiHttp);

describe('Route - Record Track', () => {
  beforeEach((done) => {
    // Create new bird
    var newBird = new Bird({
      rfid: 'recordTrack-test-rfid-number',
      name: 'recordTrack-test-bird-name'
    });

    // Create new feeder
    var newFeeder = new Feeder({
      stub: 'recordTrack-test-feeder-stub',
      name: 'recordTrack-test-feeder-name',
      location: {
        latitude: '1.0000',
        longitude: '1.0000'
      },
      lastPing: 'never'
    });

    // Save data
    newBird.save((err, bird_data) => {
      newFeeder.save((err, feeder_data) => {
        done();
      });
    });
  });

  afterEach((done) => {
    for (let model of [Bird, Feeder, Waypoint, Event]) {
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

  it('should add a single track record to waypoints and events on /recordTrack POST', (done) => {
    chai.request(server)
    .post('/api/recordTrack')
    .send({
      'datetime': 'recordTrack-test-date-time',
      'rfid': 'recordTrack-test-rfid-number',
      'stub': 'recordTrack-test-feeder-stub'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('SUCCESS');
      res.body.SUCCESS.should.be.a('object');
      res.body.SUCCESS.should.have.property('type');
      res.body.SUCCESS.should.have.property('ip');
      res.body.SUCCESS.should.have.property('datetime');
      res.body.SUCCESS.datetime.should.equal('recordTrack-test-date-time');
      chai.request(server)
      .get('/api/waypoints')
      .end((_err, _res) => {
        _res.should.have.status(200);
        _res.should.be.json;
        _res.body.should.be.a('array');
        _res.body[0].should.have.property('_id');
        _res.body[0].should.have.property('datetime');
        _res.body[0].should.have.property('bird');
        _res.body[0].should.have.property('feeder');
        _res.body[0].datetime.should.equal('recordTrack-test-date-time');
        _res.body[0].bird.should.be.a('object');
        _res.body[0].bird.should.have.property('rfid');
        _res.body[0].bird.should.have.property('name');
        _res.body[0].feeder.should.be.a('object');
        _res.body[0].feeder.should.have.property('stub');
        _res.body[0].feeder.should.have.property('name');
        _res.body[0].feeder.should.have.property('location');
        _res.body[0].feeder.should.have.property('lastPing');
        done();
      });
    });
  });

  it('should add a new bird if the RFID cannot be found in the database', (done) => {
    chai.request(server)
    .post('/api/recordTrack')
    .send({
      'datetime': 'recordTrack-test-date-time',
      'rfid': 'recordTrack-unknown-rfid-number',
      'stub': 'recordTrack-test-feeder-stub'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('SUCCESS');
      res.body.SUCCESS.should.be.a('object');
      res.body.SUCCESS.should.have.property('type');
      res.body.SUCCESS.should.have.property('ip');
      res.body.SUCCESS.should.have.property('datetime');
      res.body.SUCCESS.datetime.should.equal('recordTrack-test-date-time');
      chai.request(server)
      .get('/api/waypoints')
      .end((_err, _res) => {
        _res.should.have.status(200);
        _res.should.be.json;
        _res.body.should.be.a('array');
        _res.body[0].should.have.property('_id');
        _res.body[0].should.have.property('datetime');
        _res.body[0].should.have.property('bird');
        _res.body[0].should.have.property('feeder');
        _res.body[0].datetime.should.equal('recordTrack-test-date-time');
        _res.body[0].bird.should.be.a('object');
        _res.body[0].bird.should.have.property('rfid');
        _res.body[0].bird.should.have.property('name');
        _res.body[0].feeder.should.be.a('object');
        _res.body[0].feeder.should.have.property('stub');
        _res.body[0].feeder.should.have.property('name');
        _res.body[0].feeder.should.have.property('location');
        _res.body[0].feeder.should.have.property('lastPing');
        chai.request(server)
        .get('/api/birds')
        .end((__err, __res) => {
          __res.should.have.status(200);
          __res.should.be.json;
          __res.body.should.be.a('array');
          __res.body[1].name.should.equal('Unknown Bird');
          __res.body[1].rfid.should.equal('recordTrack-unknown-rfid-number');
          done();
        });
      });
    });
  });
});
