/**
 * Created by kaspe on 05-05-2017.
 */
var collExp = require('../models/collExpirations');
var mongoose = require('mongoose');


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
    var query = collExp.findOne({barcode: barcode, date: date, quantity: quantity});
    return query.exec(function (err,docs) {
        if(err) return err;
        else {
            return docs;
        }
    });
};


exports.getAllCollExpirations = () => {
    var query = collExp.find({});
    return query.exec(function (err,docs) {
        if(err) return err;
        else {
            return docs;
        }
    });
};

exports.deleteCollExpiration = (id) => {
    collExp.remove({_id : id}, function(err){});
};

exports.getCollExpirationById = (id) => {

    return collExp.findById(id).exec((err,docs) => {if(err) return err; else return docs;});
};

exports.updateCollExpiration = (oldId, newBarcode, newDate, newQuantity) => {

    var query = collExp.findByIdAndUpdate(oldId, {barcode: newBarcode, date: newDate, quantity: newQuantity}, {new: true});
    return query.exec(function (err, doc) {
        if(err) return err;
        else {
            return doc;
        }
    });

};
