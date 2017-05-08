/**
 * Created by kaspe on 05-05-2017.
 */
var collExp2 = require('../models/collExpirations');
var mongoose = require('mongoose');
mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;

exports.createCollExpiration = (barcode, date, quantity) => {
    let tmpItem = new collExp2({
        barcode: barcode,
        date: date,
        quantity: quantity
    });
    tmpItem.save();
    return tmpItem;
};

exports.getCollExpiration = (barcode, date, quantity) => {
    // collExp2.find({barcode: barcode, quantity: quantity}).where('date').gt(dateFrom).exec((err,docs) => {if(err) throw err; return docs;});
    console.log(1);
    var query = collExp2.findOne({barcode: barcode, date: date, quantity: quantity});
    console.log(2);
    // query.select('barcode date');
    console.log(3);
    query.exec(function (err, item) {
        console.log(4);
       console.log(item);
       if(err){
           return err;
       }else {
           return item;
       }
    });
};

exports.deleteCollExpiration = (id) => {
    // collExp2.remove({barcode: barcode, date: {
    //     $gte: new Date(date.getDate()),
    //     $lt: date
    // }, quantity: quantity});

    // collExp2.findOneAndRemove({barcode: barcode, date: date, quantity: quantity});
    collExp2.findByIdAndRemove(id);

};

exports.updateCollExpiration = (oldId, newBarcode, newDate, newQuantity) => {
    // this.createCollExpiration(newBarcode, newDate, newQuantity);
    // this.deleteCollExpiration(oldBarcode, oldDate, oldQuantity);
    collExp2.findByIdAndUpdate(oldId,{barcode : newBarcode, date : newDate, quantity : newQuantity})
};
