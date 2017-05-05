/**
 * Created by eaajejen54 on 20-04-2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
    _id: String, // gælder dobbelt som stregkode og id i mongo
    name: String,
    isDryGoods: Boolean
}, {collection: 'collProducts', versionKey: false});

module.exports = mongoose.model('Product', product);