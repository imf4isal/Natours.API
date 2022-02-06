const jwt = require('jsonwebtoken');
const User = require('./../Model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if user provide email and password
  if (!email || !password) {
    return next(new AppError('Please provide valid email and password', 400));
  }

  //check if user exist and password is correct

  const user = await User.findOne({ email }).select('+password');

  // if user doesnt exist, following line will still run.thats why direct move to the or functionality
  //   const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or password is incorrect', 401));
  }

  // if everything correct, send token to the user

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});
