/**
 * Created by eaajejen54 on 20-04-2017.
 */
const collProduct = require('../models/product');
const BARCODE_LENGTH = 8;

exports.createProduct = function(id, name, isDryGoods) {
    if(id.length === BARCODE_LENGTH && name.length > 0 && typeof(isDryGoods) === 'boolean' && typeof(id) === 'string') {
        let newProduct = new collProduct({
            _id: id,
            name: name,
            isDryGoods: isDryGoods
        });
        newProduct.save()
    } else {
        throw new Error;
    }
};