"use strict";
/* <----------------------- MODULOS --------------------------> */
import mongoose from "mongoose";



const reportSchema = new mongoose.Schema(
    {

        reportType: {
        type: String,
        enum: ['Spam','Fraude', 'Informacion falsa', 'Contenido ofensivo', 'Contenido inapropiado'],
        required: true
        },
        contentReport: {
        type: String,
        required: true
        },
        dateReport: {
        type: Date,
        required: true,
        default: Date.now
        },
        statusReport: {
        type: String,
        required: true,
        enum: ['pendiente', 'en revision', 'resuelto', 'rechazado', 'en espera', 'cerrado'], 
        default: "pendiente"
        },
        userReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
        postReport: {
            type: mongoose.Schema.Types.ObjectId, ref: "Post",
        },
    }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;