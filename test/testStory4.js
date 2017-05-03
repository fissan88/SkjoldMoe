var collExp = require('../models/collExpirations');
var assert = require("assert");

describe('Database Manipulation Krav', () => {

    describe("Registeringen virker hvis...", () => {
        it("Opret dato objekt virker", (done) => {
            var testObject = new collExp({
                barcode: 57045399,
                date: Date.now(),
                quantity: 5
            });
            testObject.save(done);
        })
    })
});