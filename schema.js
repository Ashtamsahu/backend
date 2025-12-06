const mongoose = require("mongoose");

/* ---------------- PRODUCT ---------------- */
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  des: String,
  price: Number,
  image: String
});

/* ---------------- ORDER ---------------- */
const OrderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  subtotal: Number,
  totalDiscount: Number,
  gst: Number,
  finalTotal: Number,
  date: { type: Date, default: Date.now }
});

/* ---------------- USER ---------------- */
// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, required: true, unique: true },
//   password: String
// });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // hashed password stored here
});

module.exports = { ProductSchema, OrderSchema, UserSchema };
