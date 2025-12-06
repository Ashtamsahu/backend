const mongoose = require("mongoose");
const { ProductSchema, OrderSchema, UserSchema } = require("./schema");

// Collections
const VegModel = mongoose.model("vegProducts", ProductSchema);
const NonvegModel = mongoose.model("nonvegProducts", ProductSchema);
const MilkModel = mongoose.model("milkProducts", ProductSchema);
const OrderModel = mongoose.model("orders", OrderSchema);
const UserModel = mongoose.model("users", UserSchema);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// /* ------------ REGISTER USER ------------ */
// const register = (data) => new UserModel(data).save();

// /* ------------ LOGIN USER ------------ */
// const login = async (email, password) => {
//   const user = await UserModel.findOne({ email, password });
//   return user;
// };
/* ------------------------- REGISTER ------------------------- */
const registerUser = async (data) => {
  const { name, email, password } = data;

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return { status: false, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  return { status: true, message: "Registration Successful" };
};

/* ------------------------- LOGIN ------------------------- */
const loginUser = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return { status: false, message: "User not found" };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return { status: false, message: "Invalid password" };
  }

  // Create JWT token
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    status: true,
    message: "Login Successful",
    token,
    user
  };
};

/* ------------ VEG ------------ */
const saveVeg = (data) => new VegModel(data).save();
const getVeg = () => VegModel.find();

/* ------------ NON VEG ------------ */
const saveNonveg = (data) => new NonvegModel(data).save();
const getNonveg = () => NonvegModel.find();

/* ------------ MILK ------------ */
const saveMilk = (data) => new MilkModel(data).save();
const getMilk = () => MilkModel.find();

/* ------------ ORDERS ------------ */
const saveOrder = (data) => new OrderModel(data).save();
const getOrders = () => OrderModel.find().sort({ date: -1 });

module.exports = {
  registerUser,
  loginUser,
  saveVeg,
  getVeg,
  saveNonveg,
  getNonveg,
  saveMilk,
  getMilk,
  saveOrder,
  getOrders
};
