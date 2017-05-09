/**
 * Created by tuxzo on 09-05-2017.
 */
const app = require('../server.js');
const should = require('should');
const mongoose = require('mongoose');
const CollExp = require('../models/collExpirations');

let testItem, testDate;


describe('collExpirations Model Unit Tests:', () => {
    beforeEach((done => {
        // testDate = new Date;
        // testDate.setHours(0,0,0,0);
        testItem = new CollExp({
            barcode: "hest",
            date: testDate,
            quantity: 5
        });
        testItem.save();
        done();
    }));
    afterEach((done) => {
    testItem.remove().then(done)
});

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

});




