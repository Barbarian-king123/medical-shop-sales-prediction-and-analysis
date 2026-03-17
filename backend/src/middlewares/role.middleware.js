const AppError = require("../utils/AppError");

module.exports = (...roles) => {
  return (req, res, next) => {

    if (!req.user || !roles.includes(req.user.role)) {

      // API → JSON
      if (req.originalUrl.startsWith("/api")) {
        return res.status(403).json({
          status: "fail",
          message: "Access denied"
        });
      }

      // VIEW → render 403 page
      return res.status(403).render("403");
    }

    next();
  };
};