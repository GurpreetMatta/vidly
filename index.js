require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const error = require('./middleware/error');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const movies = require('./routes/movies')
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const Joi = require('@hapi/joi');

Joi.objectId = require('joi-objectid')(Joi);

// handle unhandledRejection exception
process.on('unhandledRejection', (ex) => {
    throw ex;
});

// handle uncaught exception
winston.exceptions.handle(new transports.File({ filename: 'exceptions.log' }));

// handle logging 
winston.add(new winston.transports.File({ filename: 'combined.log' }));

// winston mongodb
winston.add(new winston.transports.MongoDB({ db: config.get('db') }));

if (!config.get('jwtSecret')) {
    console.error('FATAL ERROR: jwt key not found');
    process.exit(1);
}

app.use(express.json());
// create connection
mongoose.connect(config.get('db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('CONNECTION ESTABLISHED....'))
    .catch((error) => console.log('CONNECTION FAILED....'))

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auths', auth);

// handle error using error middleware method
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));