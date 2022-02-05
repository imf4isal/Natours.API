const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Couldn't found any valid result for ${req.originalUrl} in the server.`
  // });
  // const err = new Error(
  //   `Coundn't found any valid result for ${req.originalUrl} in the server.`
  // );
  // err.status = 'fail';
  // err.statusCode = 404;
  // whatever we pass into next function, will be considered as an error, then it will directly trigger global error function. work for any middleware. if we pass error into next function,it will skip all middleware function before global error function.
  // next(err);
  /////before creating class ^^

  next(
    new AppError(
      `Couldn't found any valid result for ${req.originalUrl} in the server.`,
      404
    )
  );
});

// if we use for argument after app.use, express will automatically identify as a global error

app.use(globalErrorHandler);

module.exports = app;
