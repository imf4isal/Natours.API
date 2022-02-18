const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug'); // setting the template engine
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARES

// serving static file
app.use(express.static(path.join(__dirname, 'public')));

// security http headers. good - using early
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// request limiter
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many request from this IP.Please try again later.'
});
app.use('/api', limiter);

//body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// data sanitization against NoSQL query Injection

app.use(mongoSanitize());

// data sanitization agains xss
app.use(xss());

// prevent parameter pollution

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAveragit ge',
      'difficulty',
      'price'
    ]
  })
);

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// 2) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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

// "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js",
// "build:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
