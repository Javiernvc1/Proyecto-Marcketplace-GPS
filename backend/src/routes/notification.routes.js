"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import notificationController from "../controllers/notification.controller.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", notificationController.getNotifications);
router.post("/", notificationController.createNotification);
router.get("/:id", notificationController.getNotificationById);
router.put("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

export default router;