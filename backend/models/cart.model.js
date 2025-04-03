const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, "Enter the customer ID!"],
    },
    items: [
      {
        productId: {
          type: String,
          required: [true, "Enter the ID of the product!"],
        },
        productName: {
          type: String,
          required: [true, "Enter the name of the product!"],
        },
        quantity: {
          type: Number,
          required: true,
          default: 1, 
          min: [1, "Quantity must be at least 1"],
        },
        information: {
          color: {
            type: String,
            required: false,
          },
          size: 
            {
              type: String,
              required: false,
            },
          
          img:{
            type: String,
            require: false
          }
        },
        type: {
          type: String,
          required: false,
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
    ],
  },
  {
    timestamps: true,
    collection: "carts",
  }
);
//đã sửa
CartSchema.methods.getTotal = function () {
  return this.items.length > 0
    ? this.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    : 0;
};

module.exports = mongoose.model("Cart", CartSchema);
