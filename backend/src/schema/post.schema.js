"use strict"

import Joi from "joi";

const postBodySchema = Joi.object({
    
    title: Joi.string().required().messages({
        "string.empty": "El titulo no puede estar vacio",
        "any.required": "El titulo es un campo requerido",
        "string.base": "El titulo debe ser de tipo texto"
    }),
    description: Joi.string().required().messages({
        "string.empty": "La descripcion no puede estar vacia",
        "any.required": "La descripcion es un campo requerido",
        "string.base": "La descripcion debe ser de tipo texto"
    }),
    author: Joi.string().required().messages({
        "string.empty": "El autor no puede estar vacío",
        "any.required": "El autor es un campo requerido",
        "string.base": "El autor debe ser de tipo texto"
    }),
    category: Joi.string().required().messages({
        "string.empty": "La categoria no puede estar vacia",
        "any.required": "La categoria es un campo requerido",
        "string.base": "La categoria debe ser de tipo texto"
    }),
})

export {
    postBodySchema
}