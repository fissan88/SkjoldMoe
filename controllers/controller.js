/**
 * Created by kaspe on 05-05-2017.
 */
var collExp = require('../models/collExpirations');
var mongoose = require('mongoose');
var testFile = require('../test/testStory4');

mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;

exports.createCollExpiration = (barcode, date, quantity) => {
    let tmpItem = new collExp({
        barcode: barcode,
        date: date,
        quantity: quantity
    });
    tmpItem.save();
    return tmpItem;
};

exports.getCollExpiration = (barcode, date, quantity) => {
    collExp.findOne({barcode: barcode, date: date, quantity: quantity},'collExpirations', function (err,docs) {
        if(err) return err;
        else {
            return docs;
        }
    });

};

exports.deleteCollExpiration = (id) => {
    collExp.remove({_id : id});
};

exports.updateCollExpiration = (oldId, newBarcode, newDate, newQuantity) => {
    collExp.findByIdAndUpdate(oldId, {barcode: newBarcode, date: newDate, quantity: newQuantity})
};
