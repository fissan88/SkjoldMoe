/**
 * Created by eaajejen54 on 20-04-2017.
 */
const collProduct = require('../models/product');
const BARCODE_REGEX = /^\d{8}|\d{13}|\d{15}$/;
const mongoose = require('mongoose');

exports.createProduct = function(id, name, isDryGoods) {
    return new Promise((reject, resolve) => {
        if(name.length > 0
            && typeof(id) === 'string'
            && BARCODE_REGEX.test(id)) {

            let newProduct = new collProduct({
                _id: id,
                name: name,
                isDryGoods: isDryGoods
            });

            newProduct.save().then(() => {
                resolve();
            });

        } else {
            throw new Error;
        }
    }).catch((e) => {
        return e;
    });
};