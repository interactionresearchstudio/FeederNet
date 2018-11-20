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

describe('Route - Time', () => {
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
});
