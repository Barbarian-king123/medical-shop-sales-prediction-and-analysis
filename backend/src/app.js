require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const routes = require("./routes");
const AppError = require("./utils/AppError");
const errorMiddleware = require("./middlewares/error.middleware");
const viewRoutes = require("./routes/view.routes");
const cookieParser = require("cookie-parser");


const app = express();

// ==============================
// GLOBAL MIDDLEWARES
// ==============================

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

// Logging
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ==============================
// ROUTES
// ==============================

app.use("/", viewRoutes);

app.use("/api", routes);

// ==============================
// 404 HANDLER
// ==============================

// app.use((req, res, next) => {
//   next(new AppError(`Route not found: ${req.originalUrl}`, 404));
// });
// ===========================
// 404 HANDLER (Must be LAST)
// ===========================
app.use((req, res, next) => {

  // If it's an API request → return JSON
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({
      status: "fail",
      message: `API route not found: ${req.originalUrl}`
    });
  }

  // Otherwise render 404 page
  res.status(404).render("404");
});
// ==============================
// GLOBAL ERROR HANDLER (LAST)
// ==============================

app.use(errorMiddleware);

module.exports = app;