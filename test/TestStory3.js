/**
 * Created by kaspe on 03-05-2017.
 */
var app = require('./../server.js');
var request = require('supertest');

describe('testing root contents', function() {

    it('frontpage is html', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });
    //
    // it('it says "Company App Demo"', function(done) {
    //     request(app)
    //         .get('/')
    //         .expect(function(res) {
    //             if (res.text.indexOf("Company App Demo") == -1) {
    //                 throw new Error("missing title")
    //             }
    //         })
    //         .expect(200, done);
    // });
    //
    // it('it returns json on /company"', function(done) {
    //     request(app)
    //         .get('/company')
    //         .expect('Content-Type', /json/)
    //         .expect(200, done);
    // });
    //
    // it('it returns json on /employee"', function(done) {
    //     request(app)
    //         .get('/employee')
    //         .expect('Content-Type', /json/)
    //         .expect(200, done);
    // });

});
