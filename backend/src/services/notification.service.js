"use strict"
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";


import { handleError } from "../utils/errorHandler.js";

async function getNotifications() {
    try {
        const notifications = await Notification.find()
            .populate("title")
            .populate("description")
            .populate("date")
            .populate("user")
            .populate("post")
            .exec();
        if (!notifications) {
            return [null, "No se encontraron notificaciones"];
        }
        return [notifications, null];
    } catch (error) {
        handleError(error, "notification.service -> getNotifications");
        return [null, error.message];
    }
}

async function createNotification(notification) {
    try {
        const { title, description, user, post } = notification;

        const userExists = await User.findOne({ _id: user})
        if (!userExists) return [null, "El usuario no existe"];

        const postExists = await Post.findOne({ _id: post });
        if (!postExists) return [null, "La publicación no existe"];

        const newNotification = new Notification({
            title,
            description,
            user,
            post
        });

        await newNotification.save();
        return [newNotification, null];
    }catch (error) {
        handleError(error, "notification.service -> createNotification");
        return [null, error.message];
    }
}

async function getNotificationsbyId(id) {
    try {
        const notification = await Notification.findById(id);
        if (!notification) {
            return [null, "Notificación no encontrada"];
        }
        return [notification, null];
    } catch (error) {
        handleError(error, "notification.service -> getNotificationsbyId");
        return [null, error.message];
    }
}

async function updateNotification(id, notification) {
    try {
        const { title, description, user, post } = notification;
        const updatedNotification = await Notification.findByIdAndUpdate(id, {
            title,
            description,
            user,
            post
        }, { new: true });
        if (!updatedNotification) {
            return [null, "Notificación no encontrada"];
        }
        return [updatedNotification, null];
    } catch (error) {
        handleError(error, "notification.service -> updateNotification");
        return [null, error.message];
    }
}

async function deleteNotification(id) {
    try {
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return [null, "Notificación no encontrada"];
        }
        return [notification, null];
    } catch (error) {
        handleError(error, "notification.service -> deleteNotification");
        return [null, error.message];
    }
}

export default {
    getNotifications,
    createNotification,
    getNotificationsbyId,
    updateNotification,
    deleteNotification
}

