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
    // collExp.find({barcode: barcode, quantity: quantity}).where('date').gt(dateFrom).exec((err,docs) => {if(err) throw err; return docs;});
    collExp.findOne({barcode: barcode, date: date,quantity: quantity}, (err, item) => {
        if (err) {
            return err;
        } else {
            console.log(item);
            return item;
        }
    });
};

exports.deleteCollExpiration = (id) => {
    // collExp.remove({barcode: barcode, date: {
    //     $gte: new Date(date.getDate()),
    //     $lt: date
    // }, quantity: quantity});

    // collExp.findOneAndRemove({barcode: barcode, date: date, quantity: quantity});
    collExp.findByIdAndRemove(id);

};

exports.updateCollExpiration = (oldId, newBarcode, newDate, newQuantity) => {
    // this.createCollExpiration(newBarcode, newDate, newQuantity);
    // this.deleteCollExpiration(oldBarcode, oldDate, oldQuantity);
    collExp.findByIdAndUpdate(oldId,{barcode : newBarcode, date : newDate, quantity : newQuantity})
};
