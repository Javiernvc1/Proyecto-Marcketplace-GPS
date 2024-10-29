"use strict"

import { handleError } from "../utils/errorHandler.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import CategoryService from "../services/category.service.js";


async function getCategories(req, res) {
    try {
        const [categories, error] = await CategoryService.getCategories();
        if (error) return respondError(req, res, 404, error);

        categories.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, categories);
    } catch (error) {
        handleError(error, 'category.controller -> getCategories');
        respondError(req, res, 400, error.message);
    }
}

async function createCategory(req, res) {
    try {
        const { body } = req;
        const [newCategory, error] = await CategoryService.createCategory(body);
        if (error) return respondError(req, res, 400, error);
        if (!newCategory) return respondError(req, res, 400, 'No se creo la categoría');
        respondSuccess(req, res, 201, newCategory);
    } catch (error) {
        handleError(error, 'category.controller -> createCategory');
        respondError(req, res, 500, 'No se creo la categoría');
    }
}

async function getCategoryById(req, res) {
    try {
        const { params } = req;
        const { id } = params;
        const [category, error] = await CategoryService.getCategoryById(id);

        if (error) return respondError(req, res, 404, error);
        respondSuccess(req, res, 200, category);
    } catch (error) {
        handleError(error, 'category.controller -> getCategoryById');
        respondError(req, res, 400, error.message);
    }
}

async function updateCategory(req, res) {
    try {
        const { params, body } = req;
        const { id } = params;
        const [category, error] = await CategoryService.updateCategory(id, body);

        if (error) return respondError(req, res, 400, error);
        if (!category) return respondError(req, res, 400, 'No se encontro categoría asociada al id ingresado');
        respondSuccess(req, res, 200, { message: 'Categoría actualizada', data: category });
    } catch (error) {
        handleError(error, 'category.controller -> updateCategory');
        respondError(req, res, 500, 'No se pudo actualizar categoría');
    }
}

async function deleteCategory(req, res) {
    try {
        const { params } = req;
        const { id } = params;
        const [category, error] = await CategoryService.deleteCategory(id);
        
        if (error) return respondError(req, res, 400, error);
        if (!category) return respondError(req, res, 400, 'No se encontro categoría asociada al id ingresado');
        respondSuccess(req, res, 200, { message: 'Categoría eliminada', data: category });

    } catch (error) {
        handleError(error, 'category.controller -> deleteCategory');
        respondError(req, res, 500, 'No se pudo eliminar categoría');
    }
}

export default {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}
