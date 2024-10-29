"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import reportRoutes from "./report.routes.js";
import notificationRoutes from "./notification.routes.js";
import categoryRoutes from "./category.routes.js";
import commentRoutes from "./comment.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);

router.use("/posts", authenticationMiddleware, postRoutes);
router.use("/reports", authenticationMiddleware, reportRoutes);
router.use("/notifications", authenticationMiddleware, notificationRoutes);
router.use("/categories", authenticationMiddleware, categoryRoutes);
router.use("/comments", authenticationMiddleware, commentRoutes);

// Exporta el enrutador
export default router;
