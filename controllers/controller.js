/**
 * Created by myBestFreind on 20-04-2017.
 */
const expiration = require('../models/expiration');
const collProduct = require('../models/product');
const collUsers = require('../models/user');
const BARCODE_REGEX = /^\d{8}|\d{13}|\d{15}$/;
const mongoose = require('mongoose');

exports.createExpiration = (barcode, date, quantity) => {
    let tmpItem = new expiration({
        barcode: barcode,
        date: date,
        quantity: quantity
    });
    tmpItem.save();
    return tmpItem;
};

exports.getExpiration = (barcode, date, quantity) => {
    let query = expiration.findOne({barcode: barcode, date: date, quantity: quantity});
    return query.exec(function (err, docs) {
        if (err) return err;
        else {
            return docs;
        }
    });
};

exports.getAllExpirations = () => {
    let query = expiration.find({});
    return query.exec(function (err, docs) {
        if (err) return err;
        else {
            return docs;
        }
    });
};

exports.deleteExpiration = (id) => {
    expiration.findOne({_id: id}, function (err, doc) {
        doc.remove((err) => {
            if (err) {
                return err;
            }
        })
    });
};

function deleteExpirationByBarcode(barcode) {
    let query = expiration.find({barcode: barcode});
    return query.exec(function (err, docs) {
        if (err) return err;
        else {
            for(let i = 0; i < docs.length; i++) {
                docs[i].remove();
            }
        }
    });
}

exports.getExpByBarcodeToday = (id) => {
    let today = new Date();
    today.setUTCHours(0,0,0,0);

    let query = expiration.find({barcode: id, date: {$gte: today}});
    return query.exec((err, docs) => {
        if (err) return err;
        else {
            return docs;
        }
    });
};

exports.deleteProduct = (id) => {
    deleteExpirationByBarcode(id);

    collProduct.findOne({_id: id}, function (err, doc) {
        doc.remove((err) => {
            if (err) {
                return err;
            }
        })
    });
};

exports.getExpirationById = (id) => {
    return expiration.findById(id).exec((err, docs) => {
        if (err) return err; else return docs;
    });
};

exports.updateExpiration = (oldId, newBarcode, newDate, newQuantity) => {
    let query = expiration.findByIdAndUpdate(oldId, {
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

exports.updateQuantityOfExpiration = (id, quantity, isChecked) => {
    let query = expiration.findByIdAndUpdate(id, {
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

exports.createProduct = function (id, name, isDryGoods, orderNumber) {
    return new Promise ((resolve, reject) => {
        if (name.length > 0
            && typeof(id) === 'string'
            && BARCODE_REGEX.test(id)) {

            let newProduct = new collProduct({
                _id: id,
                name: name,
                isDryGoods: isDryGoods,
                orderNumber: orderNumber
            });

            newProduct.save().then(resolve);
        } else {
           reject();
        }
    });
};

exports.updateProduct = (id, newName, newIsDryGoods) => {
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

exports.getProductById = (id) => {
    let query =  collProduct.findById(id);
    return query.exec((err,docs) => {
        if(err) return err;
        else return docs;
    });
};

//TODO: sender en liste med expirations fra i dag / ligger lige nu i script på klientsiden
exports.getExpToday = (inputDate) => {
    var query = expiration.find({date: inputDate});
    return query.exec(function (err, docs) {
        if (err) return err;
        else {
            return docs;
        }
    });
};


// exports.getProductsFromToday = () => {
//     return new Promise((resolve, reject) => {
//         let tempArr = [];
//         let inputDate = new Date();
//         inputDate.setUTCHours(0, 0, 0, 0);
//         let query = expiration.find({date: inputDate});
//
//         query.exec(function (err, docs) {
//             return docs;
//         }).then((docs) => {
//             return new Promise((resolve, reject) => {
//                 for (let i = 0; i < docs.length; i++) {
//                     tempArr.push(docs[i].barcode);
//                 }
//                 resolve();
//             })
//         }).then(() => {
//             return new Promise((resolve, reject) => {
//                 let query = collProduct.find({_id: tempArr});
//                 query.exec(function (err, docs) {
//                     if (err) {
//                         return err;
//                     } else resolve(docs);
//                 });
//             })
//         }).then((docs) => {
//             resolve(docs);
//         });
//     });
// };

exports.getProductsToday = () => {
    return new Promise((resolve, reject) => {
        let today = new Date();
        today.setUTCHours(0,0,0,0);

        let query = collProduct.aggregate([{
            $lookup:
                {
                    from: 'collExpirations',
                    localField: '_id',
                    foreignField: 'barcode',
                    as: 'expirations'
                }
        }]);

        query.exec(function (err, docs) {

            if (err) {
                reject(err);
            } else {
                let tmpArr = [];

                for(let i = 0; i < docs.length; i++) {
                    if(docs[i].expirations.length === 0) {
                        tmpArr.push(docs[i]);
                    } else {
                        let latestDate = docs[i].expirations[0];

                        for(let n = 0; n < docs[i].expirations.length; n++) {
                            let tempExpiration = docs[i].expirations[n].date;
                            tempExpiration.setUTCHours(0,0,0,0);
                            console.log(tempExpiration);


                            if(tempExpiration >= today) {
                                latestDate = tempExpiration;
                            }
                        }

                        if(latestDate.toString() == today.toString()) {
                            tmpArr.push(docs[i])
                        }
                    }
                }
                resolve(tmpArr);
            }
        });
    });
};

exports.filterGetProductsTodayByIsDryGoods = (isDryGoods) => {
        return new Promise((resolve, reject) => {
            let today = new Date();
            today.setUTCHours(0,0,0,0);
            let tempBoolean = (isDryGoods == 'true');

            let query = collProduct.aggregate([
                {
                    $match: {isDryGoods: tempBoolean}
                },
                {
                    $lookup:
                        {
                            from: 'collExpirations',
                            localField: '_id',
                            foreignField: 'barcode',
                            as: 'expirations'
                        }
                }
            ]);

            query.exec(function (err, docs) {

                if (err) {
                    reject(err);
                } else {
                    let tmpArr = [];

                    for(let i = 0; i < docs.length; i++) {
                            if(docs[i].expirations.length === 0) {
                                tmpArr.push(docs[i]);
                            } else {
                                let latestDate = docs[i].expirations[0];

                                for(let n = 0; n < docs[i].expirations.length; n++) {
                                    let tempExpiration = docs[i].expirations[n].date;
                                    tempExpiration.setUTCHours(0,0,0,0);

                                    if(tempExpiration >= today) {
                                        latestDate = tempExpiration;
                                    }
                                }

                                if(latestDate.toString() == today.toString()) {
                                    tmpArr.push(docs[i])
                                }
                            }
                    }
                    resolve(tmpArr);
                }
            });
        });
};

exports.filterGetProductsTodayByDate = (date) => {
    return new Promise((resolve, reject) => {
        date.setUTCHours(0,0,0,0);

        let query = collProduct
            .aggregate([{
            $lookup:
                {
                    from: 'collExpirations',
                    localField: '_id',
                    foreignField: 'barcode',
                    as: 'expirations'
                }}]);

        query.exec(function (err, docs) {
            if (err) {
                reject(err);
            } else {
                let tmpArr = [];

                for(let i = 0; i < docs.length; i++) {
                    if(docs[i].expirations.length > 0 && docs[i].expirations[0].date.toString() === date.toString()) {
                        tmpArr.push(docs[i]);
                    }
                }
                resolve(tmpArr);
            }
        });
    });
};

exports.getProductByOrderNumber = orderNumber => {

    let query =  collProduct.find({"orderNumber": orderNumber});
    return query.exec((err,docs) => {
        if(err) return err;
        else return docs;
    });
};

exports.createUser = function (name, password) {
    return new Promise ((resolve, reject) => {
        if (true) {
            let newUser = new collUsers({
                name: name,
                password: password
            });

            newUser.save().then(resolve);
        } else {
            reject();
        }
    });
};

exports.hasUsername = function (username) {
    let query =  collUsers.find({"name": username});
    return query.exec((err,docs) => {
        if(err) return err;
        else {
            return docs;
        }
    });
};