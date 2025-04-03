const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Enter the name of the product!"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    information: {
    type: {
      type: String,
      required: false
    },
    img :
      {
        type: String,
        required: false
      }
  },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

module.exports = mongoose.model("Product", ProductSchema);