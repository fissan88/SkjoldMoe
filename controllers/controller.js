/**
 * Created by eaajejen54 on 20-04-2017.
 */
var collProduct = require('../models/product');

exports.createProduct = function(id, name, isDryGoods) {
    let newProduct = new collProduct({
        _id: id,
        name: name,
        isDriedGoods: isDryGoods
    });
    newProduct.save()
};