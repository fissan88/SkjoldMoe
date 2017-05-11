/**
 * Created by tuxzo on 10-05-2017.
 */
var app = require('./../server.js');
var request = require('supertest');

suite('Testing collExpirations API Endpoints', function() {
    test('.get /api/collExpirations works', function(done) {
        request(app)
            .get('/api/collExpirations')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('.post /api/collExpirations works"', function(done) {
        request(app)
            .post('/api/collExpirations')
            .send({'barcode' : '12345678', 'date' : '2017-05-05', 'quantity' : '0'})
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('.get /api/collExpirations/:id works"', function(done) {
        request(app)
            .get('/api/collExpirations/:5')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('.put /api/collExpirations/:id works"', function(done) {
        request(app)
            .put('/api/collExpirations/:5')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('.delete /api/collExpirations/:id works"', function(done) {
        request(app)
            .delete('/api/collExpirations/:5')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
