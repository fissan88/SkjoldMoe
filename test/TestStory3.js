/**
 * Created by PWM on 05-05-2017.
 */

var collProduct = require('../models/product');
var assert = require("assert");
var mongoose = require('mongoose');
var controller = require('../controllers/controller');
var should = require('should');

mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;
describe('Database Manipulation Krav', () => {
    describe("Registeringen af produkt virker hvis...", () => {
        it("Opret og save barcode objekt virker", (done) => {
            controller.createProduct.bind(null, "1337", "Nuka Cola", false).should.not.throw(Error);
            done();
        });

        after(() => {
            console.log("1");
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

        after(() => {
            console.log("2");
        });

        it("Tjekker om der kan oprettes vare uden id", (done) => {
            controller.createProduct("", "vareNavn", false);
            done();
        });

        after(() => {
            console.log("3");
        });

        it("Tjekker om der kan oprettes vare uden navn", (done) => {
            controller.createProduct.bind(null, "13378008", "", false).should.throw(Error);
            done();
        });

        after(() => {
            console.log("4");
        });

        it("Tjekker om der kan oprettes vare uden isDryGoods", (done) => {
            controller.createProduct.bind(null, "13378008", "vareNavn", "").should.throw(Error);
            done();
        });

        after(() => {
            console.log("5");
        });

    });
});