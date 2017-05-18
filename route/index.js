/**
 * Created by eaajejen54 on 20-04-2017.
 */
var express = require('express');
var router = express.Router();

module.exports = function (express) {


    router.route('/index')
        .get(function (req, res) {
            res.render('layout2', {
            });
        })
        .post(function (req, res) {

        });

    return router;
};