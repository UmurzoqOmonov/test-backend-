const Users = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.findAll({
    attributes: ["id", "name", "lastLoginTime", "status", "email", "createdAt"],
  });
  res.json({
    status: "success",
    message: "Hamma foydalanuvchilarning ro'yxati berildi",
    error: null,
    data: { users },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const byId = await Users.findByPk(id);
  if (!byId) {
    return next(new AppError("Bunday foydalanuvchi topilmadi", 404));
  }

  await byId.destroy();
  res.json({
    status: "success",
    message: `${id}-Idli foydalanuvchi muvaffaqiyatli o'chilirldi`,
    error: null,
    data: null,
  });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const byId = await Users.findByPk(id);
  if (!byId) {
    return next(new AppError("Bunday foydalanuvchi topilmadi", 404));
  }

  const updateUser = await byId.update(req.body);
  res.json({
    status: "success",
    message: "Status muvaffaqiyatli o'zgartirildi",
    error: null,
    data: { updateUser },
  });
});
