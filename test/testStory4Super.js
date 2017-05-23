/**
 * Created by tuxzo on 10-05-2017.
 */
var app = require('./../server.js');
var request = require('supertest');

suite('Testing expirations API Endpoints', function() {
    test('.get /api/expirations works', function(done) {
        request(app)
            .get('/api/expirations')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('.post /api/expirations works"', function(done) {
        request(app)
            .post('/api/expirations')
            .send({'barcode' : '12345678', 'date' : '2017-05-05', 'quantity' : '0'})
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('.get /api/expirations/:id works"', function(done) {
        request(app)
            .get('/api/expirations/:5')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('.put /api/expirations/:id works"', function(done) {
        request(app)
            .put('/api/expirations/:5')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('.delete /api/expirations/:id works"', function(done) {
        request(app)
            .delete('/api/expirations/:5')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
