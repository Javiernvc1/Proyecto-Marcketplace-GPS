"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import postController from "../controllers/post.controller.js";
import {subirImagen} from "../middlewares/handleMulter.middleware.js";
const router = Router();

router.use(authenticationMiddleware);
router.get("/", postController.getPosts);
router.post("/",[subirImagen.array('images')], postController.createPost);
router.get("/:id", postController.getPostById);
router.get("/user/:id", postController.getUserPosts);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.post("/favorite/:postId", postController.savePostAsFavorite);
router.get("/category/:categoryId", postController.getPostByCategory);
router.get("/getUserFavoritePosts/:userId", postController.getUserFavoritePosts);

export default router;
