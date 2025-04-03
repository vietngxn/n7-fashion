const express = require("express");
const Cart = require("../models/cart.model");
const router = express.Router();

router.get("/leaderBoard", async (req, res) => {
  try {
    const pipeline = [
      {
        $unwind: {
          path: "$items",
        },
      },
      {
        $project: {
          customerId: 1,
          itemCost: { $multiply: ["$items.price", "$items.quantity"] },
          itemDetails: "$items",
          customerIdConvert: 1,
        },
      },
      {
        $addFields: {
          customerIdConvert: { $toObjectId: "$customerId" },
        },
      },
      {
        $group: {
          _id: "$customerIdConvert",
          totalSpent: { $sum: "$itemCost" },
          items: { $push: "$itemDetails" },
        },
      },
      {
        $lookup: {
          from: "customers", 
          localField: "_id",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $project: {
          customerUserName: "$customerInfo.customerUserName",
          email: "$customerInfo.email",
          totalSpent: 1,
          mostExpensiveProduct: {
            $reduce: {
              input: "$items",
              initialValue: { price: 0 },
              in: {
                $cond: {
                  if: { $gt: ["$$this.price", "$$value.price"] },
                  then: "$$this",
                  else: "$$value",
                },
              },
            },
          },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
    ];

    const leaderBoard = await Cart.aggregate(pipeline);
    res.status(200).json({ leaderBoard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API show all Carts
router.get("/showAllCart", async (req, res) => {
  try {
    const cart = await Cart.find();

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//API get cart of customer
router.get("/getCart/:idCustomer", async (req, res) => {
  try {
    const { idCustomer } = req.params;

    const cart = await Cart.findOne({ customerId: idCustomer });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found", items: [] });
    }

    res.status(200).json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//API delete one product
router.delete("/removeFromCart/:idCustomer/:productId/:size/:color", async (req, res) => {
  try {
    const { idCustomer, productId, size, color } = req.params;

    const cart = await Cart.findOne({ customerId: idCustomer });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Lọc sản phẩm trong giỏ hàng
    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== productId ||
        item.information.size !== size ||
        item.information.color !== color
    );

    await cart.save();

    res.status(200).json({ message: "Product removed from cart!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//API clear all cart
router.delete("/clearCart/:idCustomer", async (req, res) => {
  try {
    const { idCustomer } = req.params;

    const cart = await Cart.findOne({ customerId: idCustomer });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Xóa tất cả sản phẩm trong giỏ hàng
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
