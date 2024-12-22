// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const AsyncErr = require("../middlewares/asyncErr");
const userModel = require("../models/userModel");

// REGISTER A USER -
exports.registerUser = AsyncErr(async (req, res, next) => {
  const { name, email, password, location, phoneNo } = req.body;

  // FILLING ALL THE FIELDS -
  if (!name || !email || !password || !location || !phoneNo) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  // REGISTER -
  const user = await userModel.findOne({ email });

  if (user === null) {
    await userModel.create({ name, email, password, location, phoneNo });
    res.status(201).json({
      success: true,
      message: "You are registered! Please login to proceed",
    });
  } else {
    res.status(406).json({
      message: "User already exists",
    });
  }
});

// LOGIN -
exports.loginUser = AsyncErr(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password);

  // FILLING ALL THE FIELDS -
  if (!email || !password) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // VALIDATE PASSWORD -
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // GET TOKEN -
  const token = user.generateJwt(); 

  res.status(200).json({
    success: true,
    message: "You are logged in!",
    token,
    user
  });
});

