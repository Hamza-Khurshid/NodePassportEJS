var express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

var app = express();

// DB Config
const db = require('./config/keys').MongoURI;

// Connect Mongose
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected successfully..."))
    .catch(err => console.log("Mongo connection error: ", err))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

// BodyParser
app.use(express.urlencoded({ extended: false }))

// Session
app.use(session({
    secret: 'secretkey',
    resave: true,
    saveUninitialized: true
}))

// Connect flash
app.use(flash());

// Globar vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));


var PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}.`));