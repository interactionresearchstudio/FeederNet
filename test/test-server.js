process.env.NODE_ENV = 'test';

// Load modules required for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Load app and schemas
const server = require('../server/app');
const Bird = require('../server/models/bird');

// Setup chai
var should = chai.should();
chai.use(chaiHttp);

describe('Birds', () => {

    Bird.collection.drop();

    beforeEach((done) => {
        var newBird = new Bird({
            rfid: 'test-rfid-number',
            name: 'test-name'
        });
        newBird.save((err) => {
            done();
        });
    });

    afterEach((done) => {
        Bird.collection.drop();
        done();
    });

    it('should list all birds on /birds GET', (done) => {
        chai.request(server)
            .get('/birds')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('rfid');
                res.body[0].should.have.property('name');
                res.body[0].rfid.should.equal('test-rfid-number');
                res.body[0].name.should.equal('test-name');
                done();
            });
    });

    it('should list a single bird on /bird/<id> GET', (done) => {
        var newBird = new Bird({
            rfid: 'get-test-rfid-number',
            name: 'get-test-name'
        });
        newBird.save((err, data) => {
            chai.request(server)
                .get('/bird/' + data.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('rfid');
                    res.body.should.have.property('name');
                    res.body.rfid.should.equal('get-test-rfid-number');
                    res.body.name.should.equal('get-test-name');
                    res.body._id.should.equal(data.id);
                    done();
                });
        });
    });

    it('should add a single bird on /birds POST', (done) => {
        chai.request(server)
            .post('/birds')
            .send({'rfid': 'post-test-rfid-number', 'name': 'post-test-name'})
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.be.a('object');
                res.body.SUCCESS.should.have.property('rfid');
                res.body.SUCCESS.should.have.property('name');
                res.body.SUCCESS.should.have.property('_id');
                res.body.SUCCESS.rfid.should.equal('post-test-rfid-number');
                res.body.SUCCESS.name.should.equal('post-test-name');
                done();
            });
    });

    it('should update a single bird on /bird/<id> PUT', (done) => {
        chai.request(server)
            .get('/birds')
            .end((err, res) => {
                chai.request(server)
                    .put('/bird/' + res.body[0]._id)
                    .send({'name': 'update-test-name'})
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('UPDATED');
                        response.body.UPDATED.should.be.a('object');
                        response.body.UPDATED.should.have.property('name');
                        response.body.UPDATED.should.have.property('_id');
                        response.body.UPDATED.name.should.equal('update-test-name');
                        done();
                    });
            });
    });
    it('should delete a single bird on /bird/<id> DELETE', (done) => {
        chai.request(server)
            .get('/birds')
            .end((err, res) => {
                chai.request(server)
                    .delete('/bird/' + res.body[0]._id)
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('REMOVED');
                        response.body.REMOVED.should.be.a('object');
                        response.body.REMOVED.should.have.property('name');
                        response.body.REMOVED.should.have.property('_id');
                        response.body.REMOVED.name.should.equal('test-name');
                        done();
                    });
            });
    });
});
