"use strict";
import mongoose from "mongoose";


const postSchema = new mongoose.Schema(
    {
        title: {
        type: String,
        required: true,
        },
        description: {
        type: String,
        required: true,
        },
        images: {
        type: String,
        },
        createdAt: {
        type: Date,
        default: Date.now,
        },
        state: {
        type: String,
        enum: ["activo", "pausado", "cerrado"],
        default: "activo",
        },
        stars: {
        type: Number,
        default: 0,
        },
        author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
        category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        },
        comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        }],
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
