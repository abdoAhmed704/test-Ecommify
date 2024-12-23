const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const dbConnection = require("./config/database");

const categoryRouter = require("./routes/categoryRoute");
const subCategoryRouter = require("./routes/subCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const productRouter = require("./routes/productRoute");
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');

const ApiError = require("./utils/apiError");
const globalError = require("./middleWares/errorMiddleware");

dotenv.config({ path: "config.env" });

//connection data base
dbConnection();

// app express
const app = express();

//-- middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);
}

//1-Routes

app.use("/api/v1/categories/", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);

app.use("/api/v1/brands", brandRouter);


app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);


app.all("*", (req, res, next) => {
  next(new ApiError(`this route ${req.originalUrl} doesn't exists `, 400));
});

//2-Global Error Handling
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running at ${PORT}`);
});

// handle rejections outside express
process.on("unhandledRejection", (error) => {
  console.error(`unhandled Rejection Errors: ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("closing server...");
    process.exit(1);
  });
});

