const express = require("express");
const cors = require("cors");
const AppError = require("./utils/appError");
const errorController = require("./controllers/errorController");
const authRouter = require("./routes/authRouter");
const usersRouter = require("./routes/usersRouter");
const authMiddleware = require("./middlewares/authMiddlewares");
const statusMiddleware = require("./middlewares/statusMiddleware");
// Create Express App
const app = express();

// MiddleWares
app.use(express.json());
app.use(cors());

// Routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authMiddleware, statusMiddleware, usersRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Path ${req.path} not exists`, 404));
});

app.use(errorController);

module.exports = app;
