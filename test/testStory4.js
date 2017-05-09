var collExp = require('../models/collExpirations');
var assert = require("assert");
var controller = require('../controllers/controller');

var testDate = new Date;
testDate.setHours(0, 0, 0, 0);
var testItem;
var contollerTestitem;
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
            collExp.findOne({barcode: "57045399", date: testDate, quantity: 5}, (err, item) => {
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
            collExp.remove({_id: testItem["_id"]}, done);
        });
    });

    describe("CRUD funktionerne i controlleren virker hvis...", (done) => {
        it("Test af create", (done) => {
            let tmpItem = controller.createCollExpiration("5", new Date("2017-05-08"), 10);
            if (tmpItem != null) {
                contollerTestitem = tmpItem;
                done();
            }
            else done(new Error("Blev ikke oprettet"));
        });

        it("Test af get", (done) => {
            var item = controller.getCollExpiration("5", new Date("2017-05-08"), 10);
            item.then(function (doc){
                item = doc;
                if (item) {
                    done();
                } else done(new Error('Blev ikke fundet'));
            });

        });

        it("Test af update", (done) => {

            var item = contollerTestitem;
            contollerTestitem = controller.updateCollExpiration(contollerTestitem["_id"], "200", new Date("2017-05-07"), 300);
            contollerTestitem.then(function(doc){
                contollerTestitem = doc;
                if (contollerTestitem == item) {

                    done(new Error('Item er ikke opdateret'));
                } else {
                    var barcode = contollerTestitem.barcode;;
                    assert.equal(barcode, '200');
                    var itemDate = new Date("2017-05-07");
                    assert.equal(itemDate.getDate(), contollerTestitem.date.getDate());
                    assert.equal(contollerTestitem.quantity, 300);
                    done();
                }
            });
        });
        it("Test af delete", (done) => {
            controller.deleteCollExpiration(contollerTestitem["_id"]);
            // collExp.remove({_id: contollerTestitem["_id"]});
            collExp.findOne({_id: contollerTestitem["_id"]}, (err, item) => {
                if (item) {
                    done(new Error('Produkt ikke slettet'));
                } else {
                    done();
                }
            });
        });

    });
});