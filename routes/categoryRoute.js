const express = require("express");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidators");

const auth = require('../services/authService');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  imageProcessing,
} = require("../services/categoryService");

const subcategoriesRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    auth.protect,
    auth.allowedRoles("admin", "manager"),
    uploadCategoryImage,
    imageProcessing,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    auth.protect,
    auth.allowedRoles("admin", "manager"),
    uploadCategoryImage,
    imageProcessing,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    auth.protect,
    auth.allowedRoles("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
