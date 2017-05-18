/**
 * Created by PWM on 17-May-17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    name: String,
    password: String,
}, {collection: 'collUsers', versionKey: false});

module.exports = mongoose.model('User', user);