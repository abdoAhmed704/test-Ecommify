const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      require: [true, "email required"],
      unique: [true, "email must be unique"],
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      require: [true, "password required"],
      unique: true,
      minlength: [4, "Password is too small"],
    },
    passwordChangedAt: Date,
    ResetPasswordCode: String,
    ResetPasswordCodeExpire: Date,
    ResetPasswordCodeIsValid: Boolean,
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Check if the password field is modified
  if (!this.isModified("password")) return next();

  // Hash the password before saving
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;


/**
 *
 schema{name: {
 type: String, 

 }, password: String, }
 
 
 * 
 */