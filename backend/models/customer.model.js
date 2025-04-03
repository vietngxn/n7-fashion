const mongoose = require("mongoose");

const CustomerScheme = mongoose.Schema(
    {
        customerName : {
            type: String,
            required: [false, "Enter the customer name!"],
        },
        customerUserName: {
            type: String,
            required: [true, "Enter the customer username!"],
        },
        customerPassword: {
            type: String,
            required: [true, "Enter the customer password!"],
        },
        email : {
            type: String,
            required: true
        },
        customerFirstName : {
            type: String,
            required: false
        },
        customerLastName : {
            type: String,
            required: false
        },
        customerDateOfBirth : {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: false
        },
        } ,
    {
        timestamps: true,
        collection: "customers"
    }
)

module.exports = mongoose.model("Customer", CustomerScheme);

