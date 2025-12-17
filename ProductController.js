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
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        status: false, 
        message: "Name, email, and password are required" 
      });
    }

    const response = await service.registerUser(req.body);

    if (response.status === false) {
      return res.status(409).json(response); // 409 Conflict for duplicate
    }

    return res.status(201).json(response); // 201 Created for success
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ 
      status: false, 
      message: "Registration failed", 
      error: error.message 
    });
  }
};

/* ------------------------- LOGIN ------------------------- */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        status: false, 
        message: "Email and password are required" 
      });
    }

    const response = await service.loginUser(email, password);

    if (response.status === false) {
      console.log(`Login failed: ${response.message}`);
      return res.status(401).json(response);
    }

    // Verify token exists
    if (!response.token) {
      console.error("ERROR: Token not generated in login response!");
      return res.status(500).json({ 
        status: false, 
        message: "Token generation failed" 
      });
    }

    console.log(`Login successful for: ${email}, Token generated: ${response.token.substring(0, 20)}...`);

    // Success - return token and user info
    const successResponse = {
      status: true,
      message: response.message,
      token: response.token,
      user: {
        id: response.user._id,
        name: response.user.name,
        email: response.user.email
      }
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({ 
      status: false, 
      message: "Server error", 
      error: error.message 
    });
  }
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
