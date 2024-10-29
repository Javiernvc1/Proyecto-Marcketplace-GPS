"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import reportController from "../controllers/report.controller.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, reportController.getReports);
router.post("/", reportController.createReport);
router.get("/:id", reportController.getReport);
router.put("/:id", isAdmin, reportController.updateReport);
router.delete("/:id", isAdmin, reportController.deleteReport);
router.get("/user/:id", reportController.getReportsByUser);
router.get("/post/:id", reportController.getReportsByPost);
router.get("/type/:type", reportController.getReportsByType);
router.put("/status/:id", isAdmin, reportController.updateReportStatus);


export default router;