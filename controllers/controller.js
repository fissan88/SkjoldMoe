/**
 * Created by kaspe on 05-05-2017.
 */
var collExp = require('../models/collExpirations');

exports.createCollExpiration = (barcode, date, quantity) => {
    let tmpItem = new collExp({
        barcode: barcode,
        date: date,
        quantity: quantity
    });
    tmpItem.save()
    return tmpItem;
};

exports.getCollExpiration = (barcode, date, quantity) => {
    collExp.find({barcode: barcode, date: date, quantity: quantity}, (err, item) => {
        return item;
    });
};

exports.deleteCollExpiration = (barcode, date, quantity) => {
    collExp.deleteOne('collExpirations', {barcode: barcode, date: date, quantity: quantity});
};

exports.updateCollExpiration = (oldBarcode, oldDate, oldQuantity, newBarcode, newDate, newQuantity) => {
    this.createCollExpiration(newBarcode, newDate, newQuantity);
    this.deleteCollExpiration(oldBarcode, oldDate, oldQuantity);
};

// module.exports = {
//     'createCollExpiration': createCollExpiration,
//     'getCollExpiration': getCollExpiration,
//     'deleteCollExpiration': deleteCollExpiration,
//     'updateCollExpiration': updateCollExpiration
// };

//
// module.exports = mongoose.model('createCollExpiration', createCollExpiration);
// module.exports = mongoose.model('getCollExpiration', getCollExpiration);
// module.exports = mongoose.model('deleteCollExpiration', deleteCollExpiration);
// module.exports = mongoose.model('updateCollExpiration', updateCollExpiration);