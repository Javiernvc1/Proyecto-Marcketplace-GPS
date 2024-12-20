"use strict";
// Importa el modelo de datos 'Role'
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import initialCategories from "./initialCategories.js";

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */
async function createRoles() {
  try {
    // Busca todos los roles en la base de datos
    const count = await Role.estimatedDocumentCount();
    // Si no hay roles en la base de datos los crea
    if (count > 0) return;

    await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "admin" }).save(),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers
 * @returns {Promise<void>}
 */
async function createUsers() {
  try {
    const count = await User.estimatedDocumentCount();
    if (count > 0) return;

    const admin = await Role.findOne({ name: "admin" });
    const user = await Role.findOne({ name: "user" });

    await Promise.all([
      new User({
        name: "user",
        surname: "user",
        username: "user",
        description: "user test",
        gender:"Hombre",
        email: "user@email.com",
        password: await User.encryptPassword("user123"),
        roleUser: user._id,
      }).save(),
      new User({
        name: "user",
        surname: "admin",
        username: "admin",
        description: "admin test",
        gender:"Hombre",
        email: "admin@email.com",
        password: await User.encryptPassword("admin123"),
        roleUser: admin._id,
      }).save(),
    ]);
    console.log("* => Users creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

async function createCategories() {
  try {
    for (const categoryData of initialCategories) {
      const categoryExists = await Category.findOne({ nameCategory: categoryData.nameCategory });
      if (!categoryExists) {
        const newCategory = new Category(categoryData);
        await newCategory.save();
      }
    }
    console.log("=> Categorías iniciales creadas exitosamente");
  } catch (err) {
    console.error("Error creando categorías iniciales:", err);
  }
}

export { createRoles, createUsers, createCategories };
