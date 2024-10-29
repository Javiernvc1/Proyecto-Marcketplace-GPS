"use strict"

import { handleError } from "../utils/errorHandler.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import NotificationService from "../services/notification.service.js";


async function getNotifications(req, res) {
    try {
        const [notifications, error] = await NotificationService.getNotifications();
        if (error) return respondError(req, res, 404, error);

        notifications.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, notifications);
    } catch (error) {
        handleError(error, 'notification.controller -> getNotifications');
        respondError(req, res, 400, error.message);
    }
}

async function createNotification(req, res) {
    try {
        const { body } = req;
        const [newNotification, error] = await NotificationService.createNotification(body);
        if (error) return respondError(req, res, 400, error);
        if (!newNotification) return respondError(req, res, 400, 'No se creo la notificación');
        respondSuccess(req, res, 201, newNotification);
    } catch (error) {
        handleError(error, 'notification.controller -> createNotification');
        respondError(req, res, 500, 'No se creo la notificación');
    }
}

async function getNotificationById(req, res) {
    try {
        const { params } = req;
        const { id } = params;
        const [notification, error] = await NotificationService.getNotificationById(id);

        if (error) return respondError(req, res, 404, error);
        respondSuccess(req, res, 200, notification);
    } catch (error) {
        handleError(error, 'notification.controller -> getNotificationById');
        respondError(req, res, 400, error.message);
    }
}

async function updateNotification(req, res) {
    try {
        const { params, body } = req;
        const { id } = params;
        const [notification, error] = await NotificationService.updateNotification(id, body);

        if (error) return respondError(req, res, 400, error);
        if (!notification) return respondError(req, res, 400, 'No se encontro notificación asociada al id ingresado');
        respondSuccess(req, res, 200, { message: 'Notificación actualizada', data: notification });
    } catch (error) {
        handleError(error, 'notification.controller -> updateNotification');
        respondError(req, res, 500, 'No se pudo actualizar notificación');
    }
}

async function deleteNotification(req, res) {
    try {
        const { id } = req.params;
        const [notification, error] = await NotificationService.deleteNotification(id);

        if (error) return respondError(req, res, 400, error);
        if (!notification) return respondError(req, res, 400, 'No se encontro notificación asociada al id ingresado');
        respondSuccess(req, res, 200, { message: 'Notificación eliminada', data: notification });
    } catch (error) {
        handleError(error, 'notification.controller -> deleteNotification');
        respondError(req, res, 500, 'No se pudo eliminar notificación');
    }
}

export default {
    getNotifications,
    createNotification,
    getNotificationById,
    updateNotification,
    deleteNotification
}


