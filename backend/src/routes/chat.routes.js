"use strict";

import { Router } from "express";
import chatController from "../controllers/chat.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);
router.post("/start", chatController.startConversation);
router.post("/send", chatController.sendMessage);
router.get("/:conversationId", chatController.getConversation);
router.get("/user/:userId", chatController.getUserConversations);
export default router;