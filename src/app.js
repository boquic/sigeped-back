// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 👉 Rutas
import pedidoRoutes from "./routes/pedido.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();


// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Montaje de rutas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/api/pedidos", pedidoRoutes); // 👈 Ruta del sistema de pedidos

// Nota: El arranque del servidor se realiza en server.js

export default app;