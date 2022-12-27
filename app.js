const http = require("http");
const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const calcRouter = require("./route/calcRoutes");
const path = require("path");

const app = express();
app.use(helmet());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: "Too many requests from this IP.  Please try again later.",
});

app.use("/", limiter);
app.use("/", calcRouter);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(express.static(path.join(__dirname, "public"))); //access the public folder for css/stylesheets

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

module.exports = app;
