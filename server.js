const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const productRoutes = require("./routes");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// CONNECT ROUTES  
app.use("/api/v1", productRoutes);   // IMPORTANT FIX

// const MONGO_URL = "mongodb+srv://ashtamsahu2003_db_user:BhRty6WaogWT4Zvx@cluster0.bezhslc.mongodb.net/?appName=Cluster0";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
