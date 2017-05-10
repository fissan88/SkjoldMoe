/**
 * Created by PWM on 05-05-2017.
 */

const collProduct = require('../models/product');
const assert = require("assert");
const mongoose = require('mongoose');
const controller = require('../controllers/controller');
const should = require('should');


describe("Database Manipulation Krav", () => {
    describe("Oprettelsen af produkt virker hvis...", () => {
        var tempId = "";

        after((done) => {
            collProduct.remove({_id: "13378008"})
                .then(collProduct.remove({_id: "1337800811111"}).then(collProduct.remove({_id: "133780081111111"})
                    .then(done)
                ));
            done();
        });

        it("Skulle Oprette et objekt med stregkode på 8 cifre", (done) => {
            tempId = "13378008";
            controller.createProduct(tempId, "Nuka Cola", false);
            done();
        });

        it("Skulle Oprette et objekt med stregkode på 13 cifre", (done) => {
            tempId = "1337800811111";
            controller.createProduct(tempId, "Nuka Cola", false);
            done();
        });

        it("Skulle Oprette et objekt med stregkode på 15 cifre", (done) => {
            tempId = "133780081111111";
            controller.createProduct(tempId, "Nuka Cola", false);
            done();
        });

        it("Objektet er blevet hentet og verificeret fra databasen", (done) => {
            tempId = "13378008";
            controller.createProduct(tempId, "Nuka Cola", false);
            collProduct.find({_id: tempId}, (err, item) => {
                let testitem = item;
                console.log("Før testItem");
                console.log(testitem);
                if (err) {
                    done(err);
                } else {
                    assert.equal(item[0]._id, tempId);
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
            tempId = "13378008";
            controller.createProduct.bind(null, tempId, "", false).should.throw(Error);
            done();
        });
    });
});