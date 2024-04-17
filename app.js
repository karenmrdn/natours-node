const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routers/tourRouter');
const userRouter = require('./routers/userRouter');

const app = express();

// MIDDLEWARES

// express.json() - middleware to include post req body
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// express.static(...) - middleware to serve static files (open http://localhost:3000/overview.html to access it - public folder is used by default)
app.use(express.static(`${__dirname}/public`));

// creating custom middlewares
// !!! don't forget to call next() at the end
app.use((req, res, next) => {
  console.log('Custom middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
