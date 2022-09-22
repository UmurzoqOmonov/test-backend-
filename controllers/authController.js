const { compare } = require("bcrypt");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const Users = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jsonWebToken = require("jsonwebtoken");

const findByEmail = async (email) => {
  const condidate = await Users.findOne({
    where: { email: { [Op.eq]: email } },
  });

  if (condidate) {
    return condidate;
  } else {
    return null;
  }
};

const generateToken = (payload, jwtSecret, options) => {
  return new Promise((resolve, reject) => {
    jsonWebToken.sign(payload, jwtSecret, options, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const validationError = validationResult(req);
  if (validationError.errors.length > 0) {
    const err = new AppError("Validation error", 400);
    err.operational = false;
    err.name = "validationError";
    err.errors = validationError.errors;
    return next(err);
  }

  const existedUser = await findByEmail(req.body.email);

  if (existedUser) {
    return next(new AppError("Bunday foydalanuvchi mavjud", 409));
  }

  const createAdmin = await Users.create(req.body);
  const payload = {
    id: createAdmin.id,
    name: createAdmin.name,
    email: createAdmin.email,
    status: createAdmin.status,
  };

  res.status(201).json({
    status: "success",
    message: "Siz muvaffaqiyatli ro'yxatdan o'tdingiz",
    errors: null,
    data: {
      user: {
        ...payload,
      },
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const validationError = validationResult(req);
  if (validationError.errors.length > 0) {
    const err = new AppError("Validation error", 400);
    err.operational = false;
    err.name = "validationError";
    err.errors = validationError.errors;
    return next(err);
  }

  const { password, email } = req.body;

  const condidate = await findByEmail(email);
  if (condidate.status === "BLOCKED") {
    return next(new AppError("Ushbu foydalanuvchi bloklangan", 400));
  }
  if (!condidate) {
    return next(new AppError("Email yoki Parol xato kiritildi", 400));
  }

  const passwordIsMatch = await compare(password, condidate.password);
  if (!passwordIsMatch) {
    return next(new AppError("Email yoki Parol xato kiritildi", 400));
  }

  const date = new Date();

  const loginCondidate = await condidate.update({
    lastLoginTime: date,
  });
  console.log(loginCondidate);
  const payload = {
    id: condidate.id,
    name: condidate.name,
    email: condidate.email,
    status: condidate.status,
  };

  const options = {
    algorithm: "HS512",
    expiresIn: "24h",
  };

  const token = await generateToken(payload, process.env.JWT_SECRET, options);
  res.json({
    status: "success",
    message: "",
    errors: null,
    data: {
      user: {
        ...payload,
      },
      jwt: token,
    },
  });
});
