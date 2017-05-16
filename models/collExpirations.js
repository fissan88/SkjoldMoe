/**
 * Created by Kes Williams on 03-05-2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var collExpirations = new Schema({
    barcode: String,
    date: Date,
    quantity: Number,
    isChecked: Boolean
},  {collection: 'collExpirations', versionKey: false});

module.exports = mongoose.model('collExp', collExpirations);