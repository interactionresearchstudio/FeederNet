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

describe('Route - Birds', () => {

    before((done) => {
        var newBird = new Bird({
            rfid: 'test-rfid-number',
            name: 'test-name'
        });
        newBird.save((err) => {
            done();
        });
    });

    after((done) => {
        try {
            Bird.collection.drop();
        } catch (e) {
            if (e.code === 26) {
                console.log('namespace %s not found', Bird.collection.name);
            } else {
                throw e;
            }
        }
        done();
    });

    it('should list all birds on /birds GET', (done) => {
        chai.request(server)
            .get('/api/birds')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('rfid');
                res.body[0].should.have.property('name');
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
                .get('/api/bird/' + data.id)
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
            .post('/api/birds')
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
        var newBird = new Bird({
            rfid: 'update-test-rfid-number',
            name: 'update-test-name'
        });
        newBird.save((err, data) => {
            chai.request(server)
                .put('/api/bird/' + data.id)
                .send({'name': 'updated-test-name'})
                .end((error, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    response.body.should.have.property('UPDATED');
                    response.body.UPDATED.should.be.a('object');
                    response.body.UPDATED.should.have.property('rfid');
                    response.body.UPDATED.should.have.property('name');
                    response.body.UPDATED.should.have.property('_id');
                    response.body.UPDATED.rfid.should.equal('update-test-rfid-number');
                    response.body.UPDATED.name.should.equal('updated-test-name');
                    done();
                });
        });
    });

    it('should delete a single bird on /bird/<id> DELETE', (done) => {
        var newBird = new Bird({
            rfid: 'del-test-rfid-number',
            name: 'del-test-name'
        });
        newBird.save((err, data) => {
            chai.request(server)
                .delete('/api/bird/' + data.id)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    response.body.should.have.property('REMOVED');
                    response.body.REMOVED.should.be.a('object');
                    response.body.REMOVED.should.have.property('name');
                    response.body.REMOVED.should.have.property('_id');
                    response.body.REMOVED.name.should.equal('del-test-name');
                    done();
                });
        });
    });
});
