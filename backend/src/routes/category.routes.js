"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import categoryController from "../controllers/category.controller.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", categoryController.getCategories);
router.post("/", isAdmin, categoryController.createCategory);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", isAdmin, categoryController.updateCategory);
router.delete("/:id", isAdmin, categoryController.deleteCategory);

export default router;