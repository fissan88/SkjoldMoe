/**
 * Created by eaajejen54 on 20-04-2017.
 */
const collProduct = require('../models/product');
const BARCODE_REGEX = /^\d{8}|\d{13}|\d{15}$/;
const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;

exports.createProduct = function(id, name, isDryGoods) {
    // return new Promise ((resolve, reject) =>  {
        if(name.length > 0
            && typeof(isDryGoods) === 'boolean'
            && typeof(id) === 'string'
            && BARCODE_REGEX.test(id)) {
            let newProduct = new collProduct({
                _id: id,
                name: name,
                isDryGoods: isDryGoods
            });
            newProduct.save();
            // resolve()
        } else {
            throw new Error;
        }
    // });

};