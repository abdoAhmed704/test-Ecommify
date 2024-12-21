const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidators");
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  imageProcessing,
} = require("../services/brandService");

const auth = require("../services/authService");
const router = express.Router();

router
  .route("/")
  .post(
    auth.protect,
    auth.allowedRoles("admin", "manager"),
    uploadBrandImage,
    imageProcessing,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    auth.protect,
    auth.allowedRoles("admin", "manager"),
    uploadBrandImage,
    imageProcessing,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    auth.protect,
    auth.allowedRoles("admin"),
    deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
