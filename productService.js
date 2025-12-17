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
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log(`Login attempt: User not found for email: ${email}`);
      return { status: false, message: "User not found" };
    }

    // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    const isHashed = user.password && (
      user.password.startsWith('$2a$') || 
      user.password.startsWith('$2b$') || 
      user.password.startsWith('$2y$')
    );

    console.log(`Login attempt for: ${email}`);
    console.log(`Password format: ${isHashed ? 'HASHED' : 'PLAIN TEXT'}`);
    console.log(`Stored password preview: ${user.password ? user.password.substring(0, 20) + '...' : 'NULL'}`);

    let isValid = false;

    if (isHashed) {
      // Password is hashed, use bcrypt.compare
      console.log('Comparing with bcrypt...');
      isValid = await bcrypt.compare(password, user.password);
      console.log(`Bcrypt comparison result: ${isValid}`);
    } else {
      // Password is plain text (old user), compare directly
      // This handles migration from plain text to hashed passwords
      console.log('Comparing plain text passwords...');
      isValid = user.password === password;
      console.log(`Plain text comparison result: ${isValid}`);
      
      // If login succeeds with plain text, hash the password for future use
      if (isValid) {
        console.log(`Migrating password to hashed format for user: ${email}`);
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.updateOne({ _id: user._id }, { password: hashedPassword });
      }
    }

    if (!isValid) {
      console.log(`Login attempt FAILED: Invalid password for email: ${email}`);
      return { status: false, message: "Invalid password" };
    }

    console.log(`Login successful for email: ${email}`);

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured in environment variables");
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    // Return user without password
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    return {
      status: true,
      message: "Login Successful",
      token,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error("Login error:", error);
    return { status: false, message: "Login failed", error: error.message };
  }
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
