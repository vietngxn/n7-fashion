const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// import router
const ProductRouter = require("./api_router/products.router");
const CustomerRouter = require("./api_router/customer.router");
const CartRouter = require("./api_router/cart.router")
// create express app
const app = express();
// change data to json
app.use(express.json());
app.use(cors());
// connect to mongodb
//mongoose.connect("mongodb://localhost:27017/n7_fashion");
// mongoose.connect("mongodb+srv://toantran172005:T111375t@cluster0.n0uir.mongodb.net/n7_fashion?retryWrites=true&w=majority");
mongoose
  .connect("mongodb+srv://toantran172005:T111375t@cluster0.n0uir.mongodb.net/n7_fashion?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connect successfully!");
  })
  .catch((error) => {
    console.error("Failed to connect:", error);
  });



// use the router
app.use("/", ProductRouter);
app.use("/", CustomerRouter);
app.use("/", CartRouter);
// listen the server to run on port 3000
app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
