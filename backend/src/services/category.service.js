"use strict"
import Category from "../models/category.model.js";
import User from "../models/user.model.js";

import { handleError } from "../utils/errorHandler.js";

async function getCategories() {
    try {
        const categories = await Category.find();
        if (!categories) {
            return [null, "No se encontraron categorías"];
        }
        return [categories, null];
    } catch (error) {
        handleError(error, "category.service -> getCategories");
        return [null, error.message];
    }
}

async function createCategory(category) {
    try {
        const { nameCategory, descriptionCategory } = category;

        const existingCategory = await Category.findOne({ nameCategory }).exec();
        if (existingCategory) {
            return [null, "La categoría ya existe"];
        };
        const newCategory = new Category({
            nameCategory,
            descriptionCategory
        });
        await newCategory.save();
        return [newCategory, null];
    }catch (error) {
        handleError(error, "category.service -> createCategory");
        return [null, error.message];
    }
}

async function getCategoriesbyId(id) {
    try {
        const category = await Category.findById(id);
        if (!category) {
            return [null, "Categoría no encontrada"];
        }
        return [category, null];
    } catch (error) {
        handleError(error, "category.service -> getCategoriesbyId");
        return [null, error.message];
    }
}

async function updateCategory(id, category) {
    try {
        const { nameCategory, descriptionCategory } = category;
        const updatedCategory = await Category.findByIdAndUpdate(id, {
            nameCategory,
            descriptionCategory
        }, { new: true });
        if (!updatedCategory) {
            return [null, "Categoría no encontrada"];
        }
        return [updatedCategory, null];
    } catch (error) {
        handleError(error, "category.service -> updateCategory");
        return [null, error.message];
    }
}

async function deleteCategory(id) {
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return [null, "Categoría no encontrada"];
        }
        return [category, null];
    } catch (error) {
        handleError(error, "category.service -> deleteCategory");
        return [null, error.message];
    }
}

export default {
    getCategories,
    createCategory,
    getCategoriesbyId,
    updateCategory,
    deleteCategory
};

