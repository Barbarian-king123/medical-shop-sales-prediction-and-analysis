// const jwt = require("jsonwebtoken");
// const AppError = require("../utils/AppError");

// module.exports = function authenticate(req, res, next) {
//   let token;

//   // Check Authorization header
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return next(new AppError("Access token is required", 401));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user info to request
//     req.user = decoded;

//     next();
//   } catch (err) {
//     return next(new AppError("Invalid or expired token", 401));
//   }
// };

const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = function authenticate(req, res, next) {

  let token;

  // 1️⃣ Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ If not in header, check cookies (IMPORTANT FOR BILLING)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("Access token is required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};