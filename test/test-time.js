process.env.NODE_ENV = 'test';

// Load modules required for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Load app and schemas
const server = require('../server/app');
const Feeder = require('../server/models/feeder');

// Setup chai
var should = chai.should();
chai.use(chaiHttp);

describe('Route - Time', () => {
  before((done) => {
    // Create new feeder
    var newFeeder = new Feeder({
      stub: 'ping-test-feeder-stub',
      name: 'ping-test-feeder-name',
      location: {
        latitude: '51.5074',
        longitude: '0.1278'
      },
      lastPing: 'never'
    });

    // Save data
    newFeeder.save((err, feeder_data) => {
      done();
    });
  });

  after((done) => {
    try {
      Feeder.collection.drop();
    } catch (e) {
      if (e.code === 26) {
        console.log('namespace %s not found', Feeder.collection.name);
      } else {
        throw e;
      }
    }
    done();
  });

  it('should return Unix time', (done) => {
    chai.request(server)
    .get('/api/time')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('time');
      console.log(res.body.time);
      done();
    });
  });

  it('should return sunrise and sunset based on location', (done) => {
    chai.request(server)
    .get('/api/time/sunrisesunset')
    .send({
      'stub': 'ping-test-feeder-stub'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('sunrise');
      res.body.should.have.property('sunset');
      res.body.sunrise.should.have.property('hour');
      res.body.sunrise.should.have.property('minute');
      res.body.sunset.should.have.property('hour');
      res.body.sunset.should.have.property('minute');
      console.log("Sunrise: " + res.body.sunrise.hour + ":" + res.body.sunrise.minute);
      console.log("Sunset: " + res.body.sunset.hour + ":" + res.body.sunset.minute);
      done();
    });
  });
});
