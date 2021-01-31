const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// env config
require('dotenv').config();
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next();
});

// presets
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// requiring local modules
const open = require('./Routes/open');
const postFood = require('./Routes/postFood');
const auth = require('./Routes/auth');
const table = require('./Routes/table')
const utility = require('./Routes/utility')

//db connect
require('./Database/connection.js');

// port declaration
const port = process.env.PORT || 3500;

// open routes
app.use('/', open)
app.use('/auth', auth);
app.use('/add', postFood)
app.use('/table', table)
app.use('/utility', utility)

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Ohh you are lost, read the API documentation to find your way back home :)'
    })
})

// Init the server
app.listen( port, () => {
    console.log('Sever is up')
})
