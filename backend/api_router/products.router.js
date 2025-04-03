const express = require("express");
const Product = require("../models/product.model");
const router = express.Router();

// API create product
router.post("/addProduct", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API show all products
router.get("/showAllProduct", async (req, res) => {
  try {
    const products = await Product.find({});

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào!" });
    }

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
});


// API get product by id
router.get("/getProductById/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// API update product by id
router.put("/updateProductById/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API delete product by id
router.delete("/deleteProductById/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API search product by type, size, range price
router.get("/searchProduct", async (req, res) => {
  try {
    const pipeline = [];
    if (req.query.type) {
      pipeline.push({ $match: { "information.type": {$regex: req.query.type, $options: "i" } }});
    }
    if (req.query.minPrice || req.query.maxPrice) {
      const minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : 0;
            const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : Infinity;
      pipeline.push({
        $match: { price: { $gte: minPrice, $lte: maxPrice } },
      });
    }
    pipeline.push({$sort: {price: 1}});

    const products = await Product.aggregate(pipeline);
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
