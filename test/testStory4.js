var collExp = require('../models/collExpirations');
var assert = require("assert");
var mongoose = require('mongoose');



mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;
describe('Database Manipulation Krav', () => {

    var testDate = new Date;
    var testItem;

    describe("Registeringen virker hvis...", () => {
        it("Opret og save dato objekt virker", (done) => {
            var testObject = new collExp({
                barcode: "57045399",
                date: testDate,
                quantity: 5
            });
            testObject.save(done);
        });

        it("Objektet er blevet hentet og verificeret fra databasen", (done) => {


            collExp.findOne({barcode: "57045399", date: testDate.getDate(), quantity: 5}, (err, item) => {
                if (err) {
                    done(err);
                } else {
                    testItem = item;
                    assert.equal(testItem.barcode, 57045399);
                    var itemDate = new Date(testItem.date);
                    assert.equal(itemDate.getDate(), testDate.getDate());
                    assert.equal(testItem.quantity, 5);
                    done();
                }
            });
        });

        it("Objektet er blevet slettet igen fra databasen", (done) => {
            var id = new mongoose.Types.ObjectId(testItem["_id"]);

            collExp.deleteOne('collExpirations',{_id: id}, done())
        });
    })
});