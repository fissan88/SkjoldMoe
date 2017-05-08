/**
 * Created by PWM on 05-05-2017.
 */

const collProduct = require('../models/product');
const assert = require("assert");
const mongoose = require('mongoose');
const controller = require('../controllers/controller');
const should = require('should');
const connect = mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;

describe("Database Manipulation Krav", () => {
    describe("Oprettelsen af produkt virker hvis...", () => {

        afterEach((done) => {
           collProduct.remove({_id: "13378008"}, done());
        });

        it("Opret og save barcode objekt virker", (done) => {
            controller.createProduct("13378008", "Nuka Cola", false);
            done();
        });

        it("Objektet er blevet hentet og verificeret fra databasen", (done) => {
            controller.createProduct("13378008", "Nuka Cola", false);
            collProduct.find({_id: "13378008"}, (err, item) => {
                let testitem = item;
                console.log("Før testItem");
                console.log(testitem);
                if (err) {
                    done(err);
                } else {
                    assert.equal(item[0]._id, "13378008");
                    assert.equal(item[0].name, "Nuka Cola");
                    done();
                }
            });
        });

        it("Der ikke kan oprettes vare uden id", (done) => {
            controller.createProduct.bind(null, "", "vareNavn", false).should.throw(Error);
            done();
        });

        it("Der ikke kan oprettes vare uden navn", (done) => {
            controller.createProduct.bind(null, "13378008", "", false).should.throw(Error);
            done();
        });

        it("Der ikke kan oprettes vare uden isDryGoods", (done) => {
            controller.createProduct.bind(null, "13378008", "vareNavn", "").should.throw(Error);
            done();
        });

        it("Der kun kan oprettes vare med stregkode på 8 karakterer", (done) => {
            controller.createProduct.bind(null, "1337800888", "vareNavn", "").should.throw(Error);
            done();
        });

    });
});