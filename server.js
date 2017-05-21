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
const collUsers = require('./models/user');
// INITIALIZATION
// =============================================================================
app.set('port', (process.env.PORT || 8080)); // Set the port

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

// MONGODB & MONGOOSE
mongoose.connect("mongodb://user:1234@ds111461.mlab.com:11461/skjoldmoe").connection;
console.log("Connected to database ...");

// ROUTES FOR OUR API
// =============================================================================
const productRouter = require("./route/products.js")(express);
const expRouter = require('./route/expirations.js')(express);
const usersRouter = require('./route/users.js')(express);
const productsTodayRouter = require("./route/productsToday.js")(express);

app.use(productRouter);
app.use(productsTodayRouter);
app.use(expRouter);
app.use(usersRouter);


// VIEWS
// =============================================================================
app.set('view engine', 'hbs');
app.set('views', './public/views');


// SESSION & LOGIN
// =============================================================================
app.use(session({secret: 'ssshhhh'}));

let sess;

app.get('/', (req, res) => {
   sess = req.session;
   if(sess.user) {
       res.redirect('index.hbs');
   } else {
       res.render('login.hbs');
   }
});

app.post('/login', (req, res) => {
    let query =  collUsers.find({"name": req.body.username});
    query.exec((err,docs) => {
        if(err) return err;
        else {
            if (docs[0] != undefined){
                if(docs[0].password == req.body.password){
                    sess = req.session;
                    sess.username = req.body.username;
                    res.end('done');
                    return;
                }
            }
            res.end('notDone');
        }
    });

});

app.get('/index', (req, res) => {
    sess = req.session;
    if(sess.username) {
        res.render('layout2');
    } else {
        res.write('<h1>Please login first.</h1>');
    }
});


// START THE SERVER .....
// =============================================================================
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;

