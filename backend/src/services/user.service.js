"use strict";
// Importa el modelo de datos 'User'
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { handleError } from "../utils/errorHandler.js";
import { saveImageProfile } from "../utils/generalUtils.js";
import  fs  from "fs";
import  path  from "path";


/**
 * Obtiene todos los usuarios de la base de datos
 * @returns {Promise} Promesa con el objeto de los usuarios
 */
async function getUsers() {
  try {
    const users = await User.find()
      .select("-password")
      .populate("roleUser")
      .exec();
    if (!users) return [null, "No hay usuarios"];

    return [users, null];
  } catch (error) {
    handleError(error, "user.service -> getUsers");
  }
}

/**
 * Crea un nuevo usuario en la base de datos
 * @param {Object} user Objeto de usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function createUser(user, file = null) {
  try {
    const {name, surname, username, description, gender, email, password, profilePicture, roleUser } = user;

    const userFound = await User.findOne({ email: user.email });
    if (userFound) return [null, "El usuario ya existe"];

    const rolesFound = await Role.find({ name: { $in: roleUser } });
    if (rolesFound.length === 0) return [null, "El rol no existe"];
    const myRole = rolesFound.map((role) => role._id);
    const imgPicture = await saveImageProfile(profilePicture);

    const newUser = new User({
      name,
      surname,
      username,
      description,
      gender,
      email,
      password: await User.encryptPassword(password),
      profilePicture: imgPicture,
      roleUser: myRole,
    });
    await newUser.save();

    return [newUser, null];
  } catch (error) {
    handleError(error, "user.service -> createUser");
  }
}

/**
 * Obtiene un usuario por su id de la base de datos
 * @param {string} Id del usuario
 * @returns {Promise} Promesa con el objeto de usuario
 */
async function getUserById(id) {
  try {
    const user = await User.findById({ _id: id })
      .select("-password")
      .populate("roles")
      .exec();

    if (!user) return [null, "El usuario no existe"];

    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> getUserById");
  }
}

/**
 * Actualiza un usuario por su id en la base de datos
 * @param {string} id Id del usuario
 * @param {Object} user Objeto de usuario
 * @returns {Promise} Promesa con el objeto de usuario actualizado
 */
async function updateUser(id, user) {
  try {
    const userFound = await User.findById(id);
    if (!userFound) return [null, "El usuario no existe"];

    const { name, surname, username, email, description, password, newPassword, roleUser } = user;

    const matchPassword = await User.comparePassword(
      password,
      userFound.password,
    );

    if (!matchPassword) {
      return [null, "La contraseña no coincide"];
    }

    const rolesFound = await Role.find({ name: { $in: roleUser } });
    if (rolesFound.length === 0) return [null, "El rol no existe"];

    const myRole = rolesFound.map((role) => role._id);

    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        name,
        surname,
        username,
        email,
        description,
        password: await User.encryptPassword(newPassword || password),
        roleUser: myRole,
      },
      { new: true },
    );

    return [userUpdated, null];
  } catch (error) {
    handleError(error, "user.service -> updateUser");
  }
}

/**
 * Elimina un usuario por su id de la base de datos
 * @param {string} Id del usuario
 * @returns {Promise} Promesa con el objeto de usuario eliminado
 */
async function deleteUser(id) {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "user.service -> deleteUser");
  }
}




async function getUserImageByID(id){
  try {
      const user = await User.findById(id).select('profilePicture');
      if (!user || !user.profilePicture) return [null, "No se encontró la imagen de perfil del usuario"];

      const filePath = path.join(process.cwd(), 'src/uploads/profiles', user.profilePicture);
      if (!fs.existsSync(filePath)) return [null, "La imagen no existe en el servidor"];

      return [filePath, null];
  } catch (error) {
      handleError(error, "user.service -> getUserImageByID");
      return [null, "Error al obtener la imagen de perfil del usuario"];
  }
}

async function getUserByEmail(email){
  try {
    const user = await User.findOne({ email: email });
    if (!user) return [null, "El usuario no existe"];
    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> getUserByEmail");
  }
}


export default {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserImageByID,
  getUserByEmail
};
