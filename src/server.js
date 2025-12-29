import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import printRoutes from "./routes/printRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* =====================
   CORS (SAFE WAY)
===================== */
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );



app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));




/* =====================
   MIDDLEWARES
===================== */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

/* =====================
   ROUTES
===================== */
app.use("/api/products", productRoutes);
app.use("/api/bills", billingRoutes);
app.use("/api/print", printRoutes);

/* =====================
   HEALTH CHECK
===================== */
app.get("/", (req, res) => {
  res.send("✅ Shop Billing Backend Running");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
});
