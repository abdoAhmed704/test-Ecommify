const mongoose = require("mongoose");

//1-Create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);


const getURL = (doc) => {
  if (doc.image) {
    const imgeURL = `${process.env.BASE_URL}/brand/${doc.image}`;
    doc.image = imgeURL;
  }
};

brandSchema.post("save", (doc) => {
  getURL(doc);
});
brandSchema.post("init", (doc) => {
  getURL(doc);
});



//2-Create model
const BrandModel = new mongoose.model("Brand", brandSchema);


module.exports = BrandModel;
