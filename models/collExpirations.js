/**
 * Created by Kes Williams on 03-05-2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collExpirations = new Schema({
    productName: String,
    date: Date,
    quantity: Number
},  {collection: 'collExpirations', versionKey: false});