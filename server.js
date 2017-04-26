/**
 * Created by tuxzo on 04-04-2017.
 */
'use strict';

var express = require('express');        // call express
var app = express();                     // define our app using express
var bodyParser = require('body-parser');
var morgan = require('morgan');
var handlebars = require('hbs');

// INITIALIZATION
// =============================================================================
app.set('port', (process.env.PORT || 8080)); // Set the port

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

// MongdoDB and Mongoose
// var mongoose = require('mongoose');
// We pick the default Promise implementation
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost');

// Model
// var Message = require('./models/message');

// ROUTES FOR OUR APP
// =============================================================================
var indexRouter = require('./route/index.js')(express);
app.use(indexRouter);

//     .post(function (req, res) {
//         var message = new Message({
//             time: Date.now(),
//             msg: req.body.msg,
//             name: req.body.name
//         });
//
//         message.printMsg();
//         message.save(function (err) {
//             if(err) {
//                 res.status(500);
//                 res.send(err);
//             } else {
//                 res.json({msg: "message saved!"});
//             }
//         })
//
//     })
//     .delete(function (req, res)
//     {
//         Message.remove(function(err){
//             if(err){
//                 res.status(500);
//                 res.send(err);
//             } else {
//                 res.json({msg: "all messages deleted!"});
//             }
//         });
//     });
//
// router.route('/message/:id')
//     .get(function (req, res) {
//         var id = req.params.id;
//         Message.find({_id: id},function (err,msg) {
//             if(err){
//                 res.send(err);
//             }
//             else{
//                 res.json(msg);
//             }
//         })
//     })
//
//     .delete(function (req, res)
//     {
//         var id = req.params.id;
//         Message.findOneAndRemove({_id: id}, function(err) {
//             if (err) {
//                 res.status(500);
//                 res.send(err);
//             } else {
//                 res.json({msg: "message deleted!"});
//             }
//         })
//
//     }) ;



//Setup views
app.set('view engine', 'hbs');
app.set('views', './public/views');


// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});