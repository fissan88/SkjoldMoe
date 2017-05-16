/**
 * Created by myBestFreind on 20-04-2017.
 */
const collExp = require('../models/collExpirations');
const collProduct = require('../models/product');
const BARCODE_REGEX = /^\d{8}|\d{13}|\d{15}$/;
const mongoose = require('mongoose');

exports.createCollExpiration = (barcode, date, quantity) => {
    let tmpItem = new collExp({
        barcode: barcode,
        date: date,
        quantity: quantity
    });
    tmpItem.save();
    return tmpItem;
};

exports.getCollExpiration = (barcode, date, quantity) => {
    var query = collExp.findOne({barcode: barcode, date: date, quantity: quantity});
    return query.exec(function (err, docs) {
        if (err) return err;
        else {
            return docs;
        }
    });
};

exports.getAllCollExpirations = () => {
    var query = collExp.find({});
    return query.exec(function (err, docs) {
        if (err) return err;
        else {
            return docs;
        }
    });
};

exports.deleteCollExpiration = (id) => {
    collExp.findOne({_id: id}, function (err, doc) {
        doc.remove((err) => {
            if (err) {
                return err;
            }
        })
    });
};

function deleteExpirationsByBarcode(barcode) {
    let query = collExp.find({barcode: barcode});
    return query.exec(function (err, docs) {
        if (err) return err;
        else {
            for(let i = 0; i < docs.length; i++) {
                docs[i].remove();
            }
        }
    });
}

exports.deleteProduct = (id) => {
    deleteExpirationsByBarcode(id);

    collProduct.findOne({_id: id}, function (err, doc) {
        doc.remove((err) => {
            if (err) {
                return err;
            }
        })
    });

};

exports.getCollExpirationById = (id) => {
    return collExp.findById(id).exec((err, docs) => {
        if (err) return err; else return docs;
    });
};

exports.updateCollExpiration = (oldId, newBarcode, newDate, newQuantity) => {
    var query = collExp.findByIdAndUpdate(oldId, {
        barcode: newBarcode,
        date: newDate,
        quantity: newQuantity
    }, {new: true});
    return query.exec(function (err, doc) {
        if (err) return err;
        else {
            return doc;
        }
    });
};

exports.updateQuantityCollExpiration = (id, quantity, isChecked) => {
    var query = collExp.findByIdAndUpdate(id, {
        quantity: quantity,
        isChecked: isChecked
    }, {new: true});
    return query.exec(function (err, doc) {
        if (err) return err;
        else {
            return doc;
        }
    });
};

exports.createProduct = function (id, name, isDryGoods) {
    return new Promise ((resolve, reject) => {
        if (name.length > 0
            && typeof(id) === 'string'
            && BARCODE_REGEX.test(id)) {

            let newProduct = new collProduct({
                _id: id,
                name: name,
                isDryGoods: isDryGoods
            });

            newProduct.save().then(resolve);
        } else {
           reject();
        }
    });
};

exports.updateCollProducts = (id, newName, newIsDryGoods) => {

    collProduct.findOne({_id: id}, function (err, doc) {
        doc.name = newName;
        doc.isDryGoods = newIsDryGoods;
        doc.save((err) => {
            if (err) {
                return err;
            }
        })
    });
};

exports.getCollProductById = (id) => {

    var query =  collProduct.findById(id);
    return query.exec((err,docs) => {
        if(err) return err;
        else return docs;
    });
};