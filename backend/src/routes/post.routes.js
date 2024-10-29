"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import postController from "../controllers/post.controller.js";

const router = Router();

router.use(authenticationMiddleware);
router.get("/", postController.getPosts);
router.post("/", postController.createPost);
router.get("/:id", postController.getPostById);
router.get("/user/:id", postController.getUserPosts);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.post("/favorite/:postId", postController.savePostAsFavorite);
router.get("/category/:categoryId", postController.getPostByCategory);


export default router;
