/**
 * Created by tuxzo on 04-04-2017.
 */
'use strict';

const express = require('express');        // call express
const app = express();                     // define our app using express
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const handlebars = require('hbs');
const session = require('express-session');
// INITIALIZATION
// =============================================================================
app.set('port', (process.env.PORT || 8080)); // Set the port

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

// MongdoDB and Mongoose
mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;
console.log("Connected to database ...");

// Model
// var Message = require('./models/message');
    // ROUTES FOR OUR APP
// =============================================================================
const indexRouter = require('./route/index.js')(express);
const productRouter = require("./route/products.js")(express);
const expRouter = require('./route/collExpirations.js')(express);
const usersRouter = require('./route/users.js')(express);

app.use(indexRouter);
app.use(productRouter);
app.use(expRouter);
app.use(usersRouter);

//Setup views
app.set('view engine', 'hbs');
app.set('views', './public/views');

app.use(session({secret: 'ssshhhh'}));

var sess;

app.get('/', (req, res) => {
   sess = req.session;

   sess.user;
   sess.password;


   if(sess.user) {
       res.redirect('login.hbs');
   } else {
       res.render('login.hbs');
   }
});


// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;

