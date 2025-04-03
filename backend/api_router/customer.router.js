const express = require("express");
const Customer = require("../models/customer.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const router = express.Router();

// API create a new customer
router.post("/customerSignUp", async (req, res) => {
  try {
    // Username có ít nhất 5 kí tự, không chấp nhận kí tự đặc biệt
    const regexUserName = /^[a-zA-Z0-9]{5,}$/;
    // Có ít nhất 6 kí tự gồm chữ IN HOA, thường, số và kí tự đặc biệt
    const regexPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    // email không được có kí tự đặc biệt ở đầu
    const regexEmail = /^(?!_|\.)[\w.+%-]+@[a-zA-Z0-9.-]{2,}(\.[a-z]{2,})+$/;

    if (!regexUserName.test(req.body.customerUserName)) {
      return res.status(500).json({
        message: "Username must be at least 5 characters and alphanumeric!",
      });
    }

    if (!regexPassword.test(req.body.customerPassword)) {
      return res.status(500).json({
        message:
          "Password must be at least 6 characters, alphanumeric, and contain at least one uppercase, one lowercase, one number, and one special character!",
      });
    }

    if (!regexEmail.test(req.body.email)) {
      return res.status(500).json({ message: "Invalid email!" });
    }

    const customerEmail = await Customer.findOne({ email: req.body.email });
    if (customerEmail)
      return res.status(500).json({ message: "Email is exist!" });

    const customer = await Customer.create(req.body);

    const idCustomer = customer._id.toString();

    await Cart.create({ customerId: idCustomer, items: [] });

    res.status(201).json({ customer });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: error.message });
  }
});

// API login of customer
router.post("/customerSignIn", async (req, res) => {
  try {
    const { emailSignIn, customerPassword } = req.body;

    if (!emailSignIn || !customerPassword)
      return res
        .status(404)
        .json({ message: "Please enter email and password!" });

    const customer = await Customer.findOne({ email: emailSignIn });

    if (!customer)
      return res.status(404).json({ message: "Email is not exist!" });

    if (customer.customerPassword !== customerPassword)
      return res.status(404).json({ message: "Password is incorrect!" });

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API update information of customer
router.put("/customerUpdate/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      customerName,
      customerUserName,
      customerPassword,
      email,
      customerFirstName,
      customerLastName,
      customerDateOfBirth,
      address,
    } = req.body;

    const customer = await Customer.findById(id, { new: true });

    if (!customer)
      return res.status(404).json({ message: "Customer not found!" });
    if (customerName) customer.customerName = customerName;
    if (customerUserName) customer.customerUserName = customerUserName;
    if (customerPassword) customer.customerPassword = customerPassword;
    if (email) customer.email = email;
    if (customerFirstName) customer.customerFirstName = customerFirstName;
    if (customerLastName) customer.customerLastName = customerLastName;
    if (customerDateOfBirth) customer.customerDateOfBirth = customerDateOfBirth;
    if (address) customer.address = address;

    await customer.save();

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/customerUpdate/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const customer = await Customer.findById(id);
      
      if (!customer) {
          return res.status(404).json({ message: "Customer not found!" });
      }
      
      res.status(200).json(customer);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// API delete a customer
router.delete("/customerDelete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found!" });
    await Cart.findOneAndDelete({ customerId: id });
    res.status(200).json({ message: "Customer deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//đã sửa
// API add products to cart
router.post("/customerAddProduct/:idCustomer", async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { idCustomer } = req.params;
    // Lấy data từ body
    const {
      _id,
      productId,
      productName,
      quantity,
      information,
      price,
      rating,
    } = req.body;

    if (!productId || !productName || !quantity || !information || !price || !rating) {
      return res.status(400).json({ message: "Thiếu dữ liệu trong request body", data: req.body });
    }

    const cart = await Cart.findOne({ customerId: idCustomer });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log("Received Product ID:", productId);
    const product = await Product.findById(productId);
    console.log("Found Product:", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found!", receivedId: _id });
    }
    if (product.quantity < parseInt(quantity)) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    // Kiểm tra giỏ hàng có sản phẩm đó chưa, trả về product trong mảng items
    const existingProduct = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.information.size.includes(information.size[0]) &&
        item.information.color === information.color
    );

    if (existingProduct) {
      existingProduct.quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        productName,
        quantity: parseInt(quantity),
        information: information,
        price: parseInt(price),
        rating: parseInt(rating),
      });
    }
    // Cập nhật số lượng sản phẩm trong kho
    product.quantity -= parseInt(quantity);

    await cart.save();
    await product.save();

    res.status(200).json({ message: "Product added to cart successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
