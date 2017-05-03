var collExp = require('../models/collExpirations');
var assert = require("assert");
var mongoose = require('mongoose');

mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;
describe('Database Manipulation Krav', () => {

    describe("Registeringen virker hvis...", () => {
        it("Opret og save dato objekt virker", (done) => {
            var testObject = new collExp({
                barcode: 57045399,
                date: Date.now(),
                quantity: 5
            });
            testObject.save(done);
        });

        it("Objektet er blevet hentet og verificeret fra databasen", (done) => {
            var date = new Date;

            collExp.find('collExpirations', {barcode: 57045399, date: Date.now(), quantity: 5}, (err, item) => {
                if (err) {
                    done(err);
                } else {
                    
                    assert.deepEqual(item[0].barcode, 57045399);
                    var itemDate = new Date(item[0].date);
                    assert.deepEqual(itemDate, date);
                    assert.deepEqual(item[0].quantity, 5);
                }
            });
        });
    })
});