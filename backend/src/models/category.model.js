"use strict";
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        nameCategory: {
        type: String,
        required: true,
        },
        descriptionCategory: {
        type: String,
        required: true,
        },
    }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
