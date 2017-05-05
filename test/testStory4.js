var collExp = require('../models/collExpirations');
var assert = require("assert");
var controller = require('../controllers/controller');

var testDate = new Date;
testDate.setHours(0,0,0,0);
var testItem;
var testObject = new collExp({
    barcode: "57045399",
    date: testDate,
    quantity: 5
});


describe('Database Manipulation Krav', () => {

    describe("Registeringen virker hvis...", () => {
        it("Opret og save dato objekt virker", (done) => {
            testObject.save(done);
        });

        it("Objektet er blevet hentet fra databasen", (done) => {

            //
            // collExp.find({barcode: "57045399", date: testDate,quantity: 5}, (err, item) => {
            //     if (err) {
            //         done(err);
            //     } else {
            //         testItem = item;
            //         done();
            //     }
            // });


            collExp.findOne({barcode: "57045399", date: testDate,quantity: 5}, (err, item) => {
                if (err) {
                    done(err);
                } else {
                    testItem = item;
                    done();
                }
            });
        });

        it("Objektet er blevet verificeret", (done) => {

                if (testItem.length == 0) {
                    throw new Error('Item er tomt');
                } else {
                    assert.equal(testItem.barcode, 57045399);
                    var itemDate = new Date(testItem.date);
                    assert.equal(itemDate.getDate(), testDate.getDate());
                    assert.equal(testItem.quantity, 5);
                    done();
                }
        });

        it("Objektet er blevet slettet igen fra databasen", (done) => {
            collExp.remove({_id : testItem["_id"]}, done);
        });
    });

    describe("CRUD funktionerne i controlleren virker hvis...", (done) => {
        it("Test af create", (done) => {
              controller.createCollExpiration("5", testDate, 10);
              done();
        });
        it.skip("Test af get", (done) => {
            controller.getCollExpiration("5", testDate, 10);
            done();
        });
        it.skip("Test af update", (done) => {
            controller.updateCollExpiration("5", testDate, 10, "200", testDate, 300);
            done();
        });
        it("Test af delete", (done) => {
            controller.deleteCollExpiration("5", testDate, 5);
            done();
        });

    });
});