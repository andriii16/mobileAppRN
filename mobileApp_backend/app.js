var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var authenticationRouter = require("./routes/authentication");
var userRouter = require("./routes/user.route");
var shopRouter = require("./routes/shop.route");
var cartRouter = require("./routes/cart.route");
var flowerRouter = require("./routes/flower.route");
var bookmarkRouter = require("./routes/bookmark.route");

// const Connection = require("./services/mongodb.service");
const MongoDB = require("./services/mongodb.service");

// Connection();
MongoDB.connectToMongoDB();

var app = express();

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("static"));

app.use("*", require("./services/authentication.service").tokenVerification);
// app.use(
//   "/api/*",
//   require("./services/authentication.service").tokenVerification
// );
app.use("/", indexRouter);
app.use("/api", authenticationRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/cart", cartRouter);
app.use("/api/flower", flowerRouter);
app.use("/api/bookmark", bookmarkRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
