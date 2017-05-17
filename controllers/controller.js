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
            for (let i = 0; i < docs.length; i++) {
                docs[i].remove();
            }
        }
    });
}

exports.getExpByBarcodeToday = (id) => {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let query = collExp.find({barcode: id, date: {$gte: today}});
    return query.exec((err, docs) => {
        if (err) return err;
        else {
            return docs;
        }
    });
};

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

exports.updateQuantityCollExpiration = (id, quantity) => {
    var query = collExp.findByIdAndUpdate(id, {
        quantity: quantity
    }, {new: true});
    return query.exec(function (err, doc) {
        if (err) return err;
        else {
            return doc;
        }
    });
};

exports.createProduct = function (id, name, isDryGoods) {
    return new Promise((resolve, reject) => {
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

    var query = collProduct.findById(id);
    return query.exec((err, docs) => {
        if (err) return err;
        else return docs;
    });
};

//TODO: sender en liste med expirations fra i dag / ligger lige nu i script på klientsiden
exports.getExpToday = (inputDate) => {
    var query = collExp.find({date: inputDate});
    return query.exec(function (err, docs) {
        if (err) return err;
        else {
            return docs;
        }
    });
};

exports.getProductsWithNoExp()
{
    return new Promise((resolve)=>
    {
        let query = collExp.find({date: {$gte: inputDate}});

        query.exec(function (err, docs) {
            return docs;
        })
    })
}


exports.getProductsFromToday = () => {
    return new Promise((resolve, reject) => {
        let tempArr = [];
        let inputDate = new Date();
        inputDate.setUTCHours(0, 0, 0, 0);
        let query = collExp.find({date: {$gte: inputDate}});

        query.exec(function (err, docs) {
            return docs;
        }).then((docs) => {
            return new Promise((resolve, reject) => {
                for (let i = 0; i < docs.length; i++) {
                    tempArr.push(docs[i].barcode);
                }
                resolve();
            })
        }).then(() => {
            return new Promise((resolve, reject) => {
                let query = collProduct.find({_id: tempArr});
                query.exec(function (err, docs) {
                    if (err) {
                        return err;
                    } else {
                        resolve(docs);
                    }
                });
            })
        }).then((docs) => {
            resolve(docs);
        });
    });
};

exports.getProductsToday = () => {
    return new Promise((resolve) => {
        this.getProductsFromToday().then((docs) => {
            let barcodesFromProductsWithOnlyExpToday = [];

            for (let i = 0; i < docs.length; i++) {
                let crocs = this.getExpByBarcodeToday(docs[i]._id);
                crocs.then((socks) => {
                        console.log("socks længde er nu: " + socks.length);
                        if(socks)
                        {
                            barcodesFromProductsWithOnlyExpToday.push(docs[i]._id);
                        }
                        if (socks.length == 1) {
                            console.log("Pusher nu socks elemnet til array:" + socks[0].barcode);
                            barcodesFromProductsWithOnlyExpToday.push(socks[0].barcode);
                        }
                        if (i == docs.length - 1) {
                            console.log("new barcode array indeholder: " + barcodesFromProductsWithOnlyExpToday);
                            resolve(barcodesFromProductsWithOnlyExpToday)
                        }
                    }
                );
            }
        });

    }).then((focs) => {
        return new Promise((resolve, reject) => {
            let query = collProduct.find({_id: focs});
            query.exec(function (err, docs) {
                if (err) {
                    return err;
                } else {
                    resolve(docs);
                }
            });
        })
    })
};