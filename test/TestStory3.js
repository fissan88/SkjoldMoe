/**
 * Created by PWM on 05-05-2017.
 */

var collProduct = require('../models/product');
var assert = require("assert");
var mongoose = require('mongoose');

mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;
describe('Database Manipulation Krav', () => {
    describe("Registeringen af produkt virker hvis...", () => {
        it("Opret og save barcode objekt virker", (done) => {
            var testObject = new collProduct({
                _id: "13378838",
                name: "SkinkeJohnsTestSkinke",
                isDriedGoods: false
            });
            testObject.save(done);
        });

        it("Objektet er blevet hentet og verificeret fra databasen", (done) => {
            collProduct.find({_id: "13378008"}, (err, item) => {
                var testitem = item;
                console.log("Før testItem");
                console.log(testitem);
                if (err) {
                    done(err);
                } else {
                    assert.equal(item[0]._id, "13378008");
                    assert.equal(item[0].name, "SkinkeJohnsTestSkinke");
                    done();
                }
            });
        });
    });
});


