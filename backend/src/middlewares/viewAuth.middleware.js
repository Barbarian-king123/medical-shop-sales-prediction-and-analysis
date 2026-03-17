const jwt = require("jsonwebtoken");

exports.verifyViewToken = (req, res, next) => {

  const token = req.cookies.token;

  // No token → redirect immediately
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};