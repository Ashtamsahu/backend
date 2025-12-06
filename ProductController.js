const service = require("./productService");

// /* ------------ REGISTER ------------ */
// exports.register = async (req, res) => {
//   try {
//     const result = await service.register(req.body);
//     res.json({ message: "User Registered", data: result });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// /* ------------ LOGIN ------------ */
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await service.login(email, password);

//     if (!user) {
//       return res.status(401).json({ message: "Invalid Credentials" });
//     }

//     res.json({ message: "Login Successful", user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

/* ------------------------- REGISTER ------------------------- */
exports.register = async (req, res) => {
  const response = await service.registerUser(req.body);
  return res.json(response);
};

/* ------------------------- LOGIN ------------------------- */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const response = await service.loginUser(email, password);

  return res.json(response);
};

/* ------------ VEG ------------ */
exports.saveVeg = async (req, res) => {
  try {
    const result = await service.saveVeg(req.body);
    res.json({ message: "Veg Item Saved", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVegItems = async (req, res) => {
  try {
    const items = await service.getVeg();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ------------ NON VEG ------------ */
exports.saveNonveg = async (req, res) => {
  try {
    const result = await service.saveNonveg(req.body);
    res.json({ message: "Nonveg Saved", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNonvegItems = async (req, res) => {
  try {
    const items = await service.getNonveg();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ------------ MILK ------------ */
exports.saveMilk = async (req, res) => {
  try {
    const result = await service.saveMilk(req.body);
    res.json({ message: "Milk Saved", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMilkItems = async (req, res) => {
  try {
    const items = await service.getMilk();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ------------ ORDERS ------------ */
exports.saveOrder = async (req, res) => {
  try {
    const order = await service.saveOrder(req.body);
    res.json({ message: "Order Saved", data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await service.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
