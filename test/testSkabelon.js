/**
 * Created by tuxzo on 09-05-2017.
 */
const app = require('../server.js');
const contoller = require('../controllers/controller');
const should = require('should');
const mongoose = require('mongoose');
const CollExp = require('../models/collExpirations');

let testItem, testDate, controllerTestitem;


describe('collExpirations Model Unit Tests:', () => {
    beforeEach((done => {
        testDate = new Date;
        testDate.setHours(0,0,0,0);
        testItem = new CollExp({
            barcode: "hest",
            date: testDate,
            quantity: 5
        });
        done();
    }));

    describe('Tester Save Metoden', () => {
        it('Burde kunne save uden problemer', () => {
            testItem.save((err) => {
                should.not.exist(err);
            });
        });

        it('Burde ikke kunne gemme uden stregkode', () => {
            testItem.barcode = '';
            testItem.save((err) => {
                should.not.exist(err);
            });
        });

        it('Burde ikke kunne gemme uden dato', () => {
            testItem.date = '';
            testItem.save((err) => {
                should.not.exist(err);
            });
        });

        it('Burde ikke kunne gemme uden antal', () => {
            testItem.quantity = '';
            testItem.save((err) => {
                should.not.exist(err);
            });
        });
    });

    after((done) => {
        testItem.remove(() => {done();});
    });
});

describe('Contoller funktioner Unit Tests:', () => {
    beforeEach((done => {
        testDate = new Date;
        testDate.setHours(0,0,0,0);
        testItem = new CollExp({
            barcode: "hest",
            date: testDate,
            quantity: 5
        });
        done();
    }));

    it("Test af create", (done) => {
        let tmpItem = controller.createCollExpiration("5", testDate, 10);

        if(tmpItem != null){
            contollerTestitem = tmpItem;
            done();}
        else done(new Error("Blev ikke oprettet"));
    });

    it("Test af get", (done) => {
        collExp.findOne({barcode: "5", date: contollerTestitem.date, quantity: 10},'collExpirations', function (err,docs) {
            if(err) done(err);
            else {
                contollerTestitem = docs;
                done();
            }
        });
    });

    it.skip("Test af update", (done) => {
        controller.updateCollExpiration(contollerTestitem["_id"], "200", testDate, 300);
        done();
    });

    it("Test af delete", (done) => {
        controller.deleteCollExpiration(contollerTestitem["_id"]);
        done();
    });

    after((done) => {
        testItem.remove(() => {done();});
    });
});




