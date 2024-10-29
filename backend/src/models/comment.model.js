"use strict"
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    textContent: {
        type: String,
        required: true,
    },
    imageContent: {
        type: String,
    },
    dateComment: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;