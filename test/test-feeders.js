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

describe('Route - Feeders', () => {

    before((done) => {
        var newFeeder = new Feeder({
            stub: 'feeder-stub',
            name: 'feeder-name',
            location: {
                latitude: '1.0000',
                longitude: '1.0000'
            },
            lastPing: 'never',
            lastReportedRssi: 0
        });

        newFeeder.save((err) => {
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
        };
        done();
    });

    it('should list all feeders on /feeders GET', (done) => {
        chai.request(server)
            .get('/api/feeders')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('stub');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('location');
                res.body[0].should.have.property('lastPing');
                res.body[0].location.should.be.a('object');
                res.body[0].location.should.have.property('latitude');
                res.body[0].location.should.have.property('longitude');
                res.body[0].location.latitude.should.equal('1.0000');
                res.body[0].location.longitude.should.equal('1.0000');
                res.body[0].lastPing.should.equal('never');
                res.body[0].lastReportedRssi.should.equal(0);
                done();
            });
    });

    it('should list a single feeder on /feeder/<id> GET', (done) => {
        var newFeeder = new Feeder({
            stub: 'single-feeder-stub',
            name: 'single-feeder-name',
            location: {
                latitude: '1.0000',
                longitude: '1.0000'
            },
            lastPing: 'never',
            lastReportedRssi: 0
        });
        newFeeder.save((err, data) => {
            chai.request(server)
                .get('/api/feeder/' + data.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('stub');
                    res.body.should.have.property('name');
                    res.body.should.have.property('location');
                    res.body.should.have.property('lastPing');
                    res.body.stub.should.equal('single-feeder-stub');
                    res.body.name.should.equal('single-feeder-name');
                    res.body.location.should.be.a('object');
                    res.body.location.should.have.property('latitude');
                    res.body.location.should.have.property('longitude');
                    res.body.location.latitude.should.equal('1.0000');
                    res.body.location.longitude.should.equal('1.0000');
                    res.body.lastPing.should.equal('never');
                    res.body.lastReportedRssi.should.equal(0);
                    done();
                });
        });
    });

    it('should add a single feeder on /feeders POST', (done) => {
        chai.request(server)
            .post('/api/feeders')
            .send({
                'stub': 'post-test-stub',
                'name': 'post-test-name',
                'location': {'latitude': '1.0000', 'longitude': '1.0000'},
                'lastPing': 'never',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.be.a('object');
                res.body.SUCCESS.should.have.property('_id');
                res.body.SUCCESS.should.have.property('stub');
                res.body.SUCCESS.should.have.property('name');
                res.body.SUCCESS.should.have.property('location');
                res.body.SUCCESS.should.have.property('lastPing');
                res.body.SUCCESS.stub.should.equal('post-test-stub');
                res.body.SUCCESS.name.should.equal('post-test-name');
                res.body.SUCCESS.location.should.be.a('object');
                res.body.SUCCESS.location.should.have.property('latitude');
                res.body.SUCCESS.location.should.have.property('longitude');
                res.body.SUCCESS.location.latitude.should.equal('1.0000');
                res.body.SUCCESS.location.longitude.should.equal('1.0000');
                res.body.SUCCESS.lastPing.should.equal('never');
                done();
            });
    });

    it('should update a single feeder on /feeder/<id> PUT', (done) => {
        var newFeeder = new Feeder({
            stub: 'update-test-stub',
            name: 'update-test-name',
            location: {
                latitude: '1.0000',
                longitude: '1.0000'
            },
            lastPing: 'never'
        });
        newFeeder.save((err, data) => {
            chai.request(server)
                .put('/api/feeder/' + data.id)
                .send({'name': 'updated-test-name'})
                .end((error, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    response.body.should.have.property('UPDATED');
                    response.body.UPDATED.should.be.a('object');
                    response.body.UPDATED.should.have.property('_id');
                    response.body.UPDATED.should.have.property('stub');
                    response.body.UPDATED.should.have.property('name');
                    response.body.UPDATED.should.have.property('location');
                    response.body.UPDATED.should.have.property('lastPing');
                    response.body.UPDATED.stub.should.equal('update-test-stub');
                    response.body.UPDATED.name.should.equal('updated-test-name');
                    response.body.UPDATED.location.should.be.a('object');
                    response.body.UPDATED.location.should.have.property('latitude');
                    response.body.UPDATED.location.should.have.property('longitude');
                    response.body.UPDATED.location.latitude.should.equal('1.0000');
                    response.body.UPDATED.location.longitude.should.equal('1.0000');
                    response.body.UPDATED.lastPing.should.equal('never');
                    done();
                });
        });
    });

    it('should delete a single feeder on /feeder/<id> DELETE', (done) => {
        var newFeeder = new Feeder({
            stub: 'del-test-stub',
            name: 'del-test-name',
            location: {
                latitude: '1.0000',
                longitude: '1.0000'
            },
            lastPing: 'never'
        });
        newFeeder.save((err, data) => {
            chai.request(server)
                .delete('/api/feeder/' + data.id)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    response.body.should.have.property('REMOVED');
                    response.body.REMOVED.should.be.a('object');
                    response.body.REMOVED.should.have.property('_id');
                    response.body.REMOVED.should.have.property('stub');
                    response.body.REMOVED.should.have.property('name');
                    response.body.REMOVED.should.have.property('location');
                    response.body.REMOVED.should.have.property('lastPing');
                    response.body.REMOVED.stub.should.equal('del-test-stub');
                    response.body.REMOVED.name.should.equal('del-test-name');
                    response.body.REMOVED.location.should.be.a('object');
                    response.body.REMOVED.location.should.have.property('latitude');
                    response.body.REMOVED.location.should.have.property('longitude');
                    response.body.REMOVED.location.latitude.should.equal('1.0000');
                    response.body.REMOVED.location.longitude.should.equal('1.0000');
                    response.body.REMOVED.lastPing.should.equal('never');
                    done();
                });
        });
    });
});
