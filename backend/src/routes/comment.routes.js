import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";

import commentController from "../controllers/comment.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

import {subirImagen} from "../middlewares/handleMulter.middleware.js";


const router = Router();

router.use(authenticationMiddleware);

router.post("/createComment", [subirImagen.array('imageComment')],commentController.createComment);
router.get("/getComment/:id", commentController.getComment);
router.put("/updateComment/:id", commentController.updateComment);
router.delete("/deleteComment/:id", commentController.deleteComment);
router.get("/getCommentsByUser/:id", commentController.getCommentsByUser);
router.put("/editComment/:id", commentController.editComment);
router.get("/getCommentsByPost/:id", commentController.getCommentsByPost);

export default router;