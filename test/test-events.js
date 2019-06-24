process.env.NODE_ENV = 'test';

// Load modules required for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const async = require('async');

// Load app and schemas
const server = require('../server/app');
const Event = require('../server/models/event');

// Setup chai
var should = chai.should();
chai.use(chaiHttp);

describe('Route - Events', () => {
  before((done) => {
    var newEvent = new Event({
      'type': 'test-type',
      'ip': '0.0.0.0',
      'datetime': 'test-datetime'
    });
    newEvent.save((err) => {
      done();
    });
  });

  after((done) => {
    try {
      Event.collection.drop();
    } catch (e) {
      if (e.code === 26) {
        console.log('namespace %s not found', Event.collection.name);
      } else {
        throw e;
      }
    }
    done();
  });

  it('should list all events on /events GET', (done) => {
    chai.request(server)
    .get('/api/events')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('_id');
      res.body[0].should.have.property('type');
      res.body[0].should.have.property('ip');
      res.body[0].should.have.property('datetime');
      done();
    });
  });

  it('should list a single event on /event/<id> GET', (done) => {
    var newEvent = new Event({
      'type': 'single-test-type',
      'ip': '0.0.0.0',
      'datetime': 'single-test-datetime'
    });
    newEvent.save((err, data) => {
      chai.request(server)
      .get('/api/event/' + data.id)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('type');
        res.body.should.have.property('ip');
        res.body.should.have.property('datetime');
        res.body.type.should.equal('single-test-type');
        res.body.ip.should.equal('0.0.0.0');
        res.body.datetime.should.equal('single-test-datetime')
        res.body._id.should.equal(data.id);
        done();
      });
    });
  });

  it('should add a single event on /events POST', (done) => {
    chai.request(server)
    .post('/api/events')
    .send({
      'type': 'post-test-type',
      'ip': '0.0.0.0',
      'datetime': 'post-test-datetime'
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
      res.body.SUCCESS.should.have.property('_id');
      res.body.SUCCESS.type.should.equal('post-test-type');
      res.body.SUCCESS.ip.should.equal('0.0.0.0');
      res.body.SUCCESS.datetime.should.equal('post-test-datetime');
      done();
    });
  });

  it('should update a single event on /event/<id> PUT', (done) => {
    var newEvent = new Event({
      'type': 'update-test-type',
      'ip': '0.0.0.0',
      'datetime': 'update-test-datetime'
    });
    newEvent.save((err, data) => {
      chai.request(server)
      .put('/api/event/' + data.id)
      .send({'type': 'updated-test-type'})
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('UPDATED');
        response.body.UPDATED.should.be.a('object');
        response.body.UPDATED.should.have.property('type');
        response.body.UPDATED.should.have.property('ip');
        response.body.UPDATED.should.have.property('datetime');
        response.body.UPDATED.should.have.property('_id');
        response.body.UPDATED.type.should.equal('updated-test-type');
        response.body.UPDATED.ip.should.equal('0.0.0.0');
        response.body.UPDATED.datetime.should.equal('update-test-datetime');
        done();
      });
    });
  });

  it('should delete a single event on /event/<id> DELETE', (done) => {
    var newEvent = new Event({
      'type': 'del-test-type',
      'ip': '0.0.0.0',
      'datetime': 'del-test-datetime'
    });
    newEvent.save((err, data) => {
      chai.request(server)
      .delete('/api/event/' + data.id)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('REMOVED');
        response.body.REMOVED.should.be.a('object');
        response.body.REMOVED.should.have.property('type');
        response.body.REMOVED.should.have.property('_id');
        response.body.REMOVED.type.should.equal('del-test-type');
        done();
      });
    });
  });

  it('should return a number of paginated events, with a page offset on /events GET', (done) => {
    // Create 10 events
    var eventNames = [
      "paginated-test-0",
      "paginated-test-1",
      "paginated-test-2",
      "paginated-test-3",
      "paginated-test-4",
      "paginated-test-5",
      "paginated-test-6",
      "paginated-test-7",
      "paginated-test-8",
      "paginated-test-9",
    ];
    async.each(eventNames, (eventName, callback) => {
      var newEvent = new Event({
        'type': eventName,
        'ip': '0.0.0.0',
        'datetime': 'paginated-test-datetime'
      });
      newEvent.save((err, data) => {
        if (err) {
          console.log("ERROR: Failed to save event.");
          callback();
        } else {
          callback();
        }
      });
    }, (err) => {
      console.log("INFO: Requesting events...");
      chai.request(server)
      .get('/api/events/4/5')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('docs');
        res.body.docs.should.be.a('array');
        res.body.docs.length.should.equal(5);
        console.log(res.body);
        done();
      });
    });
  });
});
