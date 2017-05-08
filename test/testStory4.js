var collExp = require('../models/collExpirations');
var assert = require("assert");
var controller = require('../controllers/controller');

var testDate = new Date;
testDate.setHours(0,0,0,0);
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

            //
            // collExp2.find({barcode: "57045399", date: testDate,quantity: 5}, (err, item) => {
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
              let tmpItem = controller.createCollExpiration("5", new Date("2017-05-08"), 10);

              if(tmpItem != null){
                  contollerTestitem = tmpItem;
                  done();}
              else done(new Error("Blev ikke oprettet"));
        });
        it("Test af get", (done) => {
            let tmpItems = controller.getCollExpiration("5", contollerTestitem.date, 10);

            //mangler værificering af indhold
            if(tmpItems != null) done();
            else done(new Error("Blev ikke fundet"));
        });
        it.skip("Test af update", (done) => {
            controller.updateCollExpiration(contollerTestitem["_id"], "200", testDate, 300);
            done();
        });
        it.skip("Test af delete", (done) => {
            controller.deleteCollExpiration(contollerTestitem["_id"]);
            done();
        });

    });
});