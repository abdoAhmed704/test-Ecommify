const express = require("express");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updatePasswordValidator,
} = require("../utils/validators/userValidators");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  imageProcessing,
  updatePassword,
} = require("../services/userService");

const auth = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    auth.protect,
    auth.allowedRoles("admin"),
    uploadUserImage,
    imageProcessing,
    createUserValidator,
    createUser
  )
  .get(auth.protect, auth.allowedRoles("admin"), getUsers);
router
  .route("/:id")
  .get(auth.protect, auth.allowedRoles("admin"), getUserValidator, getUser)
  .put(
    auth.protect,
    auth.allowedRoles("admin"),
    uploadUserImage,
    imageProcessing,
    updateUserValidator,
    updateUser
  )
  .delete(
    auth.protect,
    auth.allowedRoles("admin"),
    deleteUserValidator,
    deleteUser
  );

router
  .route("/updatePassword/:id")
  .put(updatePasswordValidator, updatePassword);

module.exports = router;
