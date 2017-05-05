/**
 * Created by kaspe on 05-05-2017.
 */
var collExp = require('../models/collExpirations');
var mongoose = require('mongoose');

var createCollExpiration = (barcode, date, quantity) => {
    var item = new collExp({
        barcode: barcode,
        date: date,
        quantity: quantity
    });
    item.save();
    return item;
};

var getCollExpiration = (barcode, date, quantity) => {
    collExp.find({barcode: barcode, date: date, quantity: quantity}, (err, item) => {
        return item;
    });
};

var deleteCollExpiration = (barcode, date, quantity) => {
    collExp.deleteOne('collExpirations', {barcode: barcode, date: date, quantity: quantity});
};

var updateCollExpiration = (oldBarcode, oldDate, oldQuantity, newBarcode, newDate, newQuantity) => {
    createCollExpiration(newBarcode, newDate, newQuantity);
    deleteCollExpiration(oldBarcode, oldDate, oldQuantity);
};

module.exports = {
    'createCollExpiration': createCollExpiration,
    'getCollExpiration': getCollExpiration,
    'deleteCollExpiration': deleteCollExpiration,
    'updateCollExpiration': updateCollExpiration
};

//
// module.exports = mongoose.model('createCollExpiration', createCollExpiration);
// module.exports = mongoose.model('getCollExpiration', getCollExpiration);
// module.exports = mongoose.model('deleteCollExpiration', deleteCollExpiration);
// module.exports = mongoose.model('updateCollExpiration', updateCollExpiration);