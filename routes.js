// const express = require("express");
// const router = express.Router();
// const controller = require("./ProductController");

// // /* -------- USER -------- */
// router.post("/register", controller.register);
// router.post("/login", controller.login);

// /* -------- VEG -------- */
// router.post("/saveVeg", controller.saveVeg);
// router.get("/veg", controller.getVegItems);

// /* -------- NON VEG -------- */
// router.post("/saveNonveg", controller.saveNonveg);
// router.get("/nonveg", controller.getNonvegItems);

// /* -------- MILK -------- */
// router.post("/saveMilk", controller.saveMilk);
// router.get("/milk", controller.getMilkItems);

// /* -------- ORDERS -------- */
// router.post("/saveOrder", controller.saveOrder);
// router.get("/orders", controller.getOrders);

// module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("./ProductController");
// const auth = require("./authentication"); // NEW 🔥
const authMiddleware = require("./authentication");

// PUBLIC ROUTES (no token required)
router.post("/register", controller.register);
router.post("/login", controller.login);


router.use(authMiddleware);

router.post("/saveVeg",  controller.saveVeg);
router.get("/veg",  controller.getVegItems);

router.post("/saveNonveg",  controller.saveNonveg);
router.get("/nonveg",  controller.getNonvegItems);

router.post("/saveMilk",  controller.saveMilk);
router.get("/milk",  controller.getMilkItems);

router.post("/saveOrder",  controller.saveOrder);
router.get("/orders",  controller.getOrders);

module.exports = router;



