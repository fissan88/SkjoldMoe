/**
 * Created by Kes Williams on 03-05-2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var expiration = new Schema({
    barcode: String,
    date: Date,
    quantity: Number,
    isChecked: Boolean
},  {collection: 'collExpirations', versionKey: false});

module.exports = mongoose.model('Expiration', expiration);