"use strict";

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        title: {
        type: String,
        required: true,
        },
        description: {
        type: String,
        required: true,
        },
        date: {
        type: Date,
        default: Date.now,
        },
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
        post: {
            type: mongoose.Schema.Types.ObjectId, ref: "Post",
        },
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;